angular.module('sessionCore').factory('SessionCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            /*function createSession(title, description){
                var deferred = $q.defer()
                console.log(title);
                console.log(description);
                deferred.resolve();
                return promise.deferred;
            }*/

            function getSessions() {
                var deferred = $q.defer();
                console.log("esto");
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
            };

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
                getSessions: getSessions
            });

        }]);