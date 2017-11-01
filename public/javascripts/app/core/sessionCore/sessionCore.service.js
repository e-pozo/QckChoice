angular.module('sessionCore').factory('SessionCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {
            function updateSession() {
                var deferred = $q.defer();
                $http.put('/api/sessionUser/:id')
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
    
            function deleteSession() {
                var deferred = $q.defer();
                $http.delete('/api/sessionUser/:id')
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

            function validateSession(id) {
                var deferred = $q.defer();
                $http.get('/api/thisSession/'+id)
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

            return ({
                createSession: createSession,
                getSessions: getSessions,
                deleteSession: deleteSession,
                updateSession: updateSession,
                listSessions: listSessions,
                validateSession: validateSession
            });

        }]);