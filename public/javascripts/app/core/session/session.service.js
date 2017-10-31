angular.module('session').factory('Session',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            function createSession(sessionName, sessionDescription) {
                var deferred = $q.defer();
                $http.post('/api/sessionUser', {title: sessionName, description: sessionDescription})
                // handle success
                    .then(function (data) {
                        if(data.status === 200){
                            deferred.resolve();
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
                createSession: createSession
            });

        }]);
