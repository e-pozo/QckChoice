angular.module('inviteCore').factory('inviteCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            function addSession() {
                var deferred = $q.defer();
                $http.post('/api/session/:id/join/:keyPass')
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

            return ({
                addSession: addSession
            });

        }]);