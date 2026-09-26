import express, {Request, Response, NextFunction, Application} from 'express';
import cors from 'cors';
import pool from './db';
import {timeIsInBounds, getErrorMessage, generateAvailableTimes, removeBookedTimes, removeBreakTimes, removeInfringedTimes, fillHashmap, getServiceTimesQuery} from './helperfunctions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { QueryResult } from 'pg';
require('dotenv').config();

const app: Application = express();
app.use(express.json());
app.use(cors());
const PORT:number = 5000;

app.listen(PORT, ()=> console.log(`express srvr ${PORT}`));

//Post (Lägg till ny service, bokning och anställd)
app.post('/postservice', async(req: Request, res: Response) => {
    try {
        console.log(req.body);
        const sn = req.body.service_name, sp = req.body.price;
        const newService = await pool.query("INSERT INTO services (service_name, price) VALUES ($1, $2) RETURNING *", [sn, sp]);
        res.json(newService.rows[0]);

    } catch(e) {
        console.error(getErrorMessage(e));
    }
});

app.post('/postbooking', async(req: Request, res: Response) => {
    try {
        console.log(req.body);
        const {serviceID, time, date, barberID, customerName, customerNr } = req.body;//BESTÄM OM TIMEDATE SKA VARA 1 ELR 2 ATTRIBUTES
        if (!timeIsInBounds(time, date)) {
            return res.status(400).json({ error: 'Requested booking time is out of bounds' });
        }
       /* 
        let queryS : string;
        let slotCheck : QueryResult<any>;
        if(barberID == "allAvailableBarbers"){
            queryS = "SELECT barber_id FROM bookings WHERE time BETWEEN $1 AND $2";
            slotCheck = await pool.query(queryS, [preTime(time)+1, endTime(time)-1]); 

            if(slotCheck.rows.length === 0){
                
            }
        }else{
            queryS = "SELECT * FROM bookings WHERE barber_id = $1 AND time BETWEEN $2 AND $3";
            slotCheck = await pool.query(queryS, [barberID, preTime(time)+1, endTime(time)-1]);
        }

        if(slotCheck.rows.length === 0){
            const newBooking = await pool.query("INSERT INTO bookings (service_id, time, date, barber_id, customer_name, customer_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [serviceID, time, date, barberID, customerName, customerNr]);
            res.json(newBooking.rows[0]);
        } else{
            res.status(400).json({error : "Time not available"});
        }
*/
    } catch(e) {
        console.error(getErrorMessage(e));
    }
});

app.post('/createaccount', async(req: Request, res: Response) => {
    try {
        const {barber_name, password, email, accesstype} = req.body;
        const nypassword = await bcrypt.hash(password, 10);
        const newBarber = await pool.query("INSERT INTO barbers (barber_name, password, email, accesstype) VALUES ($1, $2, $3, $4) RETURNING *", [barber_name, nypassword, email, accesstype]);
        res.json(newBarber.rows[0]);
    } catch(e) {
        console.error(getErrorMessage(e));
        res.status(500).send();
    }
});

//(login)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userQuery = await pool.query("SELECT * FROM barbers WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        //---------- Bcrypt
        const passwordMatch = await bcrypt.compare(password, userQuery.rows[0].password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }
        //---------- JWT
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
            if (!accessTokenSecret) {
                throw new Error('Access token secret not provided');
            }
        const token = jwt.sign(userQuery.rows[0], accessTokenSecret); // --- JWT SIGN ---
        res.json({ message: "Login successful", accessToken: token });

    } catch (e) {
        console.error(getErrorMessage(e));
        res.status(500).send("Internal Server Error");
    }
});

function authenticateToken(req: Request, res:Response, next:NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new Error('Access token secret not provided');
    }

    jwt.verify(token, accessTokenSecret, (err, user)=>{
        if(err) return res.sendStatus(403);
        //@ts-ignore
        req.user = user;
        next();
    });
}

//GET
app.get('/weekschedule', async(req: Request, res: Response) => {
    try {
        const {startDate, serviceIDarray} = req.body;
        const sDate: Date = new Date(startDate);
        let endDate: Date = new Date();
        endDate.setDate(sDate.getDate() + 7);
        const serviceIDs : number[] = serviceIDarray;

        // week är schedule X bookings, om schedule har null värden är dagen ledig med fria tider, 
        // annars innehåller den tider där bokningar sker, dessa måste subtraheras
        // const week = await pool.query("SELECT schedule.date::TEXT AS formatted_date, schedule.clockin, schedule.clockout, bookings.time, bookings.barber_id, bookings.booking_id FROM schedule LEFT OUTER JOIN bookings ON schedule.date = bookings.date WHERE schedule.date BETWEEN $1 AND $2", [startDate, endDate]);
        const week = await pool.query("SELECT date::TEXT AS formatted_date, clockin, clockout, barber_id FROM schedule WHERE date BETWEEN $1 AND $2", [startDate, endDate]);
        const bookings = await pool.query("SELECT date::TEXT AS formatted_date, time, barber_id, booking_id, timeforcut FROM bookings WHERE date BETWEEN $1 AND $2", [startDate, endDate]);
        const breaks = await pool.query("SELECT date::TEXT AS formatted_date, barber_id, breakstart, breakend FROM breaks WHERE date BETWEEN $1 AND $2", [startDate, endDate]);
        console.log(serviceIDs);
        const serviceTimes = await pool.query(getServiceTimesQuery(serviceIDs), serviceIDs);
        // alla tuples av week på ett datum hamnar såhär:
        // [date] = [(date, clockin, clockout, booking time, barberid), (-II-)]
        const weekData : {[date: string] : any[]} = fillHashmap(week);
        const bookingData : {[date: string] : any[]} = fillHashmap(bookings);
        const breakData : {[date: string] : any[]} = fillHashmap(breaks);
        let timeCurrentBookingTakes : number = 0;

        //date är key, value är time : barber_id pair, [date] = [1100 : [2,1]]
        const availableTimes: {[date: string] : {[key:number]: number[]}} = {};
        const allBarberIds = new Set<number>();

        for(const row of serviceTimes.rows){
            timeCurrentBookingTakes += row.timeforservice;
        }

        for(const datum in weekData){
            availableTimes[datum] = {};
            for(let i = 0; i < weekData[datum].length; i++){
                generateAvailableTimes(weekData[datum][i].clockin, weekData[datum][i].clockout, availableTimes[datum], weekData[datum][i].barber_id);
                allBarberIds.add(weekData[datum][i].barber_id);
            }
        }
        //ta bort upptagna tider från availableTimes
        for(const datum in bookingData){
            for(let i = 0; i < bookingData[datum].length; i++){
                removeBookedTimes(bookingData[datum][i].time, bookingData[datum][i].barber_id, availableTimes[datum], bookingData[datum][i].timeforcut);
            }
        }

        for(const datum in breakData){
            for(let i = 0; i < breakData[datum].length; i++){
                removeBreakTimes(breakData[datum][i].breakstart, breakData[datum][i].barber_id, availableTimes[datum], breakData[datum][i].breakend);
            }
        }

        //om barber rast börjar 15:20 kan man inte boka något som tex tar 20min vid 15:10, då måste 15:10 bort
        //ska kunna bli overridden av employees & admins
        for(const datum in availableTimes){
            for(const id of allBarberIds){
                removeInfringedTimes(timeCurrentBookingTakes, availableTimes[datum], id);
            }
        }

        res.json(availableTimes);

    } catch(e) {
        console.error(getErrorMessage(e));
        res.status(500).send();
    }
});

app.route('/routetest').get((req: Request, res:Response) =>{
    res.send("GOT");
}).post((req: Request, res:Response) =>{
    console.log("serverside");
    return res.send("POSTED");
});

app.all('/allpath', (req: Request, res: Response)=>{
    return res.sendStatus(200);
});

app.post('/poststest', authenticateToken, (req, res) => {
    res.json("mvg");
});

app.get('/matte', (req: Request, res: Response) => {
    let time: number = req.body.time;
    let answer = time;
    return res.json({answer});

});

app.get('/path', (req: Request, res: Response) => {
    return res.json({
        success:true,
        name: "wanesco"
    });
    
});

app.get('/things/:thing', (req: Request, res: Response) => {
    console.log(req.params);
    return res.send(req.params);
});

function mdw1(req: Request, res: Response, next: NextFunction){
    console.log("mdw1 ran");
    next();
}
function mdw2(req: Request, res: Response){
    console.log("mdw2");
    return res.send("done");
}


app.get('/nexttest', [mdw1, mdw2]);

app.get('/err', (req: Request, res: Response) => {
   throw new Error("Boom!");
});

async function throwsError(){
    throw new Error("Boom!");
}

app.get("/asyncErr", async (req: Request, res:Response) =>{
    try{
        await throwsError();
        res.sendStatus(200);
    }catch(e){
        res.status(400).send('as err didnt go through');
    }
});
