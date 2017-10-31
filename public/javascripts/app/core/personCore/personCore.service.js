angular.module('sessionCore').factory('SessionCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {
            function localSignUp() {
                var deferred = $q.defer();
                $http.post('/api/signUp')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve("Successful sign up!")
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

            function localSignIn() {
                var deferred = $q.defer();
                $http.delete('/api/logIn')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve("Login successful.")
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

            function getPerson() {
                var deferred = $q.defer();
                $http.get('/api/localPerson')
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

            function create() {
                var deferred = $q.defer();
                $http.post('/api/createAnonymousPerson')
                // handle success
                    .then(function (data) {
                        if(data.status === 200){
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
                create: create,
                getPerson: getPerson,
                localSignIn: localSignIn,
                localSignUp: localSignUp
            });

        }]);