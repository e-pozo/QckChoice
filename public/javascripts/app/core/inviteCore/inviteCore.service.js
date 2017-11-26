angular.module('inviteCore').factory('InviteCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            function inviteToSession(id,keypass) {
                var deferred = $q.defer();
                /*$http.post('/api/session/'+id+'/join/'+keypass)
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
                    });*/
                deferred.resolve();
                return deferred.promise;
            }

            return ({
                inviteToSession: inviteToSession
            });
}]);