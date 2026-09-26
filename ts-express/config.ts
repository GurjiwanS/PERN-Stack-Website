//if closing time is 19:00 and a booking time is 45min then this is 18:15 fråga papis
export const lastBookingTime : {[key:string] : number} = {
    'monday':1815,
    'tuesday':1815,
    'wednesday':1815,
    'thursday':1815,
    'friday':1815,
    'saturday':1815,
    'sunday':0
};

export const firstBookingTime : {[key:string] : number} = {
    'monday':1100,
    'tuesday':1100,
    'wednesday':1100,
    'thursday':1100,
    'friday':1100,
    'saturday':1100,
    'sunday':0
};

export const availableDays: {[key:string] : boolean} = {
    'monday':true,
    'tuesday':true,
    'wednesday':true,
    'thursday':true,
    'friday':true,
    'saturday':true,
};

export const timeResolution : number = 10;
//export const timeForCut : number = timeResolution*3;