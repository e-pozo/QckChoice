angular.module('sessionCore').factory('SessionCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {
            function updateSession(id, title, description) {
                var deferred = $q.defer();
                $http.put('/api/sessionUser/'+id, {title: title, description: description})
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
                        deferred.reject(err);
                    });
                return deferred.promise;
            }
    
            function deleteSession(id) {
                var deferred = $q.defer();
                $http.delete('/api/sessionUser/'+id)
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve("Session deleted successfully.")
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
            
            function getSessions() {
                var deferred = $q.defer();
                $http.get('/api/sessionUser')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve(result.data);
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

            function getThisSession(id) {
                var deferred = $q.defer();
                $http.get('/api/thisSession/'+id)
                    .then(function (result) {
                        if(result.status == 200){
                            deferred.resolve(result.data[0]);
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

            function listSessions() {
                var deferred = $q.defer();
                $http.get('/api/sessionParticipating')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve(result.data);
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

            function createSession(title, description) {
                var deferred = $q.defer();
                $http.post('/api/sessionUser', {title: title, description: description})
                // handle success
                    .then(function (data) {
                        if(data.status === 201){
                            deferred.resolve("Session created successfully!");
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

            function inviteToSession(id,keypass) {
                var deferred = $q.defer();
                $http.post('/api/session/'+id+'/join/'+keypass)
                // handle success
                    .then(function (data) {
                        if(data.status === 201){
                            deferred.resolve("Session added successfully!");
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

            function finishSession(id){
                var deferred = $q.defer();
                $http.post('/api/session/'+id+'/finish',{})
                    .then(function(result) {
                        if(result.status === 201){
                            deferred.resolve(result.result);
                        }
                        else{
                            deferred.reject(result.result);
                        }
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            function listParticipants(id){
                var deferred = $q.defer();
                $http.get('/api/session/'+id+'/participants')
                    .then(function(result) {
                        if(result.status === 200){
                            deferred.resolve(result.data.result);
                        }
                        else{
                            deferred.reject(result);
                        }
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            function getPeopleWhoVote(id){
                var deferred = $q.defer();
                $http.get('/api/session/'+id+'/peopleWhoVote')
                    .then(function(result){
                        if(result.status === 200){
                            deferred.resolve(result.data.result)
                        }
                        else{
                            deferred.reject(result);
                        }
                    })
                    .catch(function(err){
                        deferred.reject(err);
                    });
                return deferred.promise
            }

            function changeTime(sessionId, time){
                var deferred = $q.defer();
                $http.post('/api/session/'+sessionId+'/setTime',{time: time})
                    .catch(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            function toggleTime(sessionId, time){
                var deferred = $q.defer();
                $http.post('/api/session/'+sessionId+'/toggleTime',{time: time})
                    .catch(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            return ({
                createSession: createSession,
                getSessions: getSessions,
                deleteSession: deleteSession,
                updateSession: updateSession,
                listSessions: listSessions,
                getThisSession: getThisSession,
                inviteToSession: inviteToSession,
                finishSession: finishSession,
                listParticipants: listParticipants,
                getPeopleWhoVote: getPeopleWhoVote,
                changeTime: changeTime,
                toggleTime: toggleTime
            });

        }]);