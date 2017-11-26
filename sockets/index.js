'use strict';
let Counters = [];

function isInArr(arr, elem){
    for (let thisElem of arr){
        if(thisElem === elem){
            return true;
        }
    }
    return false;
}

function addOne (id, personId){
    let found = false;
    for (let i=0; i<Counters.length; i++){
        if(Counters[i].id === id){
            found = true;
            if(!isInArr(Counters[i].personIds,personId)){
                Counters[i].personIds.push(personId);
            }
            break;
        }
    }
    if (!found){
        Counters.push({id: id, personIds: [personId]})
    }
}

function lessOne (id, personId){
    for (let i=0; i<Counters.length; i++){
        if(Counters[i].id === id){
            let index = Counters[i].personIds.indexOf(personId);
            if (index > -1){
                Counters[i].personIds.splice(index, 1);
            }

        }
    }
}



module.exports = io => {
    io.on('connection', socket => {
        console.log('user connected');
        socket.on('chat message', msg => {
            console.log(msg);
            socket.broadcast.emit('chat message'+msg.event, msg);
        });

        socket.on('theTime', msg => {
            console.log(msg);
            socket.broadcast.emit('setTimer:'+msg.sessionId, msg.time);
        });

        socket.on('getTimer', msg => {
            socket.broadcast.emit('getTimer:'+msg);
        });

        socket.on('connectedToSession', data => {
           addOne(data.id, data.personId);
           console.log(Counters);
        });

        socket.on('disconnectedToSession', data => {
            lessOne(data.id, data.personId);
            console.log(Counters);
        })
    });

    function getSessionsConnections() {
        return Counters;
    }

    const toExport = {
        getSessionsConnections: getSessionsConnections
    };

    return toExport;
};