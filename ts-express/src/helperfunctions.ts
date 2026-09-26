import { hash } from 'bcrypt';
import {lastBookingTime, firstBookingTime, availableDays, timeResolution} from '../config';
import { QueryResult } from 'pg';

export function timeIsInBounds(time: number, date:any){
    if(time % 100 > 59){ return false; } //tex 13:64

    const dateObject = new Date(date);
    const dayOfWeek = dateObject.toLocaleDateString('sv-SE', { weekday: 'long' });

    if(dayOfWeek in availableDays){
        if(time < lastBookingTime[dayOfWeek] && time > firstBookingTime[dayOfWeek]){
            if(((time % 100) % timeResolution == 0)){
                return true;
            }
        }
    }
    return false;
}
/*
export function endTime(time : number){
    //if 1330 ska end time vara 1415 vid tfc 45 , 245 + (45-45), 330
    let minuter = time % 100;
    if(time+timeForCut>2359){return 2359;}
    if((minuter+timeForCut > 59)){
        return (((time+100) - (time%100)) + ((minuter+timeForCut) % 60)); 
    }else{
        return (time+timeForCut);
    }
}

export function preTime(time:number){
    let minuter = time % 100;
    if(time-timeForCut<0){return 0;}
    if((minuter-timeForCut < 0)){
        console.log("time: " + ((minuter-timeForCut+60) % 60));
        return (((time-100) - minuter) + ((minuter-timeForCut+60) % 60));
    }else{
        return (time-timeForCut);
    }
}
*/
export function generateAvailableTimes(clockin: number, clockout: number, hashmap: {[key:number]: number[]}, id: number){
    clockin = roundUpToTenth(clockin);
    clockout = roundDownToTenth(clockout);
    const cim:number = clockin % 100;
    const com:number = clockout % 100;
    const minutes:number = com - cim;
  
    const cih:number = (clockin - cim)/100;
    const coh:number = (clockout - com)/100;
    const hours:number = coh - cih;
  
    const timeslots:number = Math.floor((hours*60)/timeResolution + (minutes/timeResolution));

    let currentTime = clockin;
    
    for(let i = 0; i < timeslots; i++){
        if(!(currentTime in hashmap)){
            hashmap[currentTime] = [id];
        }else{
            hashmap[currentTime].push(id);
        }
        currentTime =  addTime(currentTime, timeResolution);
    }
}

function addTime(time: number, addition:number){
    if((time%100) + addition > 59){
        return (((time+100) - (time%100)) + (((time%100)+addition) % 60));
    }
    return time+addition;
}

function subractTime(time: number, subtraction: number){
    if(time-subtraction<0){return 0;}
    if(((time%100)-subtraction < 0)){
        return (((time-100) - (time%100)) + (((time%100)-subtraction+60) % 60));
    }else{
        return (time-subtraction);
    }

}

export function removeBookedTimes(bookingtime: number, barberid: number, hashmap: {[key:number]: number[]}, timeForCut: number){
    const slotsToDelete = Math.ceil(timeForCut/timeResolution);
    let currentTime = bookingtime;
    for(let i = 0; i < slotsToDelete; i++){
        deleteBarberAtTime(currentTime, hashmap, barberid);   
        currentTime = addTime(currentTime, timeResolution);
    }
}

export function removeBreakTimes(breakstart: number, barberid: number, hashmap: {[key:number]: number[]}, breakend: number){
    breakend = roundUpToTenth(breakend);
    breakstart = roundDownToTenth(breakstart);

    let currentTime = breakstart;
    while(currentTime < breakend){
        deleteBarberAtTime(currentTime, hashmap, barberid);
        currentTime = addTime(currentTime, timeResolution);
    }
}

/**om barber rast börjar 15:20 kan man inte boka något som tex tar 20min vid 15:10, då måste 15:10 bort
    
**/
export function removeInfringedTimes(timeForCut:number, hashmap: {[key:number]: number[]}, barberid: number){
    const slotsToDelete = Math.ceil(timeForCut/timeResolution);
    const timesArray: number[] = [];
    let deleteList: number[] = [];
    let lowerLimit: number = 0;

    for(const time in hashmap){//endast tider för barberid ska behandlas
        const timeInt:number = +time;
        if(hashmap[time].includes(barberid)){
            timesArray.push(timeInt);
        }
    }

    console.log("before sort: " + timesArray);
    timesArray.sort((a,b) => a - b);
    console.log("after sort: " + timesArray);

    if(timeForCut > timeResolution){//om tfc <= tr så kan alla tider bokas, då behöver inget raderas
        if(timeForCut > timesArray.length * timeResolution){deleteList = timesArray;}
        else{
            for(let i = 1; i < timesArray.length; i++){
                if(subractTime(timesArray[i], timeResolution) != timesArray[i-1]){//kolla hur last case går till
                    for(let k = 1; k < slotsToDelete; k++){
                        if((i-k) >= lowerLimit){
                            if(timesArray[i-k] != undefined){deleteList.push(timesArray[i-k]);}
                        }
                    }
                    lowerLimit = i;
                }
            }
            deleteList.push(timesArray[timesArray.length-1]); //last case ska alltid bort
        }
    }

    for(let i = 0; i < deleteList.length; i++){
        deleteBarberAtTime(deleteList[i], hashmap, barberid);
    }
}

function deleteBarberAtTime(currentTime:number, hashmap: {[key:number]: number[]}, barberid:number){
    if(hashmap[currentTime] != undefined){
        const indexToDelete = hashmap[currentTime].indexOf(barberid);
        if (indexToDelete !== -1) {
            hashmap[currentTime].splice(indexToDelete, 1);
            if(hashmap[currentTime].length === 0){
                delete hashmap[currentTime];
            }
        }
    }  
}

function roundUpToTenth(nr:number){ while(nr % 10 != 0){nr++;}
    return nr;
}

function roundDownToTenth(nr:number){while(nr % 10 != 0){nr--;}
    return nr;
}

export function fillHashmap(query: QueryResult<any>){
    const hmap : {[date: string] : any[]} = {};
    for (const row of query.rows) {
        const datum:string = row.formatted_date;
        if (!hmap[datum]) {
            hmap[datum] = [];
        }
        hmap[datum].push(row);
    }
    return hmap;
}

export function getServiceTimesQuery(serviceIDs: number[]){
    let query: string = "SELECT timeforservice FROM services WHERE service_id IN ($1";
    for(let i = 2; i <= serviceIDs.length; i++){
        query += ", $" + i;
    }
    query += ")";
    console.log(query);
    return query;
}

export function getErrorMessage(error: unknown): string {
    if(error instanceof Error){
        return error.message;
    } else if(error && typeof error === "object" && "message" in error){
        return String(error.message);
    } else if(typeof error === "string"){
        return error;
    } else {
        return "Something went wrong.";
    }
}

