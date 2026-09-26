const timeResolution = 10;

function removeInfringedTimes(timeForCut, hashmap, barberid){
    const slotsToDelete = Math.ceil(timeForCut/timeResolution);
    const timesArray = [];
    let deleteList = [];
    let lowerLimit = 0;

    for(const time in hashmap){//endast tider för barberid ska behandlas
        const timeInt = +time;
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
        console.log("deleting " + deleteList[i]);
        deleteBarberAtTime(deleteList[i], hashmap, barberid);
    }
}

function deleteBarberAtTime(currentTime, hashmap, barberid){
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

function subractTime(time, subtraction){
    let minuter = time % 100;
    if(time-subtraction<0){return 0;}
    if((minuter-subtraction < 0)){
        return (((time-100) - minuter) + ((minuter-subtraction+60) % 60));
    }else{
        return (time-subtraction);
    }

}

console.log(subractTime(1430, 90));

let hm1 = {
    1000: [2, 3, 1],
    1010: [2,3],
    1020: [2,1],
    1030: [3,1],
    1040: [3],
    1050: [2,1],
    1100: [2,1],
    1200: [2,1],
    1210: [2]
};

let hm2 = {
    1000: [2,3],
    1020: [2],
    1030: [2]
};

removeInfringedTimes(20, hm2, 2);
console.log(hm2); //2 bör raderas från: 1020, 1100 och 1210