angular.module('eventCore').factory('EventCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location,) {

            var Votes = [];

            function updateEvent(id, idEvent, objective) {
                var deferred = $q.defer();
                $http.put('/api/sessionUser/'+id+'/event/'+idEvent,{objective: objective})
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 201){
                            deferred.resolve(result.data)
                        }
                        else{
                            deferred.reject(result.data)
                        }
                    })
                    .catch(function (err){
                        console.log(err);
                        deferred.reject(err)
                    });
                return deferred.promise;
            }

            function deleteEvent(id, idEvent) {
                var deferred = $q.defer();
                $http.delete('/api/sessionUser/'+id+'/event/'+idEvent)
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve("Event deleted successfully.")
                        }
                        else{
                            deferred.reject(result.data)
                        }
                    })
                    .catch(function (err){
                        console.log(err);
                        deferred.reject(err)
                    });
                return deferred.promise;
            }

            function listEvent(id) {
                var deferred = $q.defer();
                $http.get('/api/session/'+id)
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve(result.data.result);
                        }
                        else{
                            deferred.reject(result);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        deferred.reject(err)
                    });
                return deferred.promise;
            }

            function makeEvent(id, objective) {
                var deferred = $q.defer();
                $http.post('/api/sessionUser/'+id, {objective: objective})
                // handle success
                    .then(function (data) {
                        if(data.status === 201){
                            deferred.resolve("Event created successfully!");
                        }
                        else {
                            deferred.reject(data);
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }

            function getThisEvent(id, idEvent){
                var deferred = $q.defer();
                $http.get('/api/session/'+id+'/thisEvent/'+idEvent)
                    .then(function (data) {
                        if(data.status === 200){
                            deferred.resolve(data);
                        }
                        else{
                            deferred.reject(data);
                        }
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    })
                return deferred.promise;
            }

            function listChoices(){
                var deferred = $q.defer();
                $http.get('/api/choices')
                    .then(function (data) {
                        if(data.status === 200){
                            deferred.resolve(data);
                        }
                        else{
                            deferred.reject(data);
                        }
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            function saveVote(idEvent, voteList){
                for(i = 0; i < Votes.length; i++){
                    if(Votes[i].idEvent === idEvent){
                        Votes[i] = {idEvent: idEvent, voteList: voteList};
                        console.log(Votes);
                        return;
                    }
                }
                Votes.push({idEvent: idEvent, voteList: voteList});
            }

            function loadVotesOfThisEvent(idEvent){
                for(i = 0; i < Votes.length; i++){
                    if(Votes[i].idEvent === idEvent){
                        return Votes[i].voteList;
                    }
                }
                return null;
            }

            return ({
                makeEvent: makeEvent,
                listEvent: listEvent,
                deleteEvent: deleteEvent,
                updateEvent: updateEvent,
                getThisEvent: getThisEvent,
                listChoices: listChoices,
                saveVote: saveVote,
                loadVotesOfThisEvent: loadVotesOfThisEvent
            });

        }]);