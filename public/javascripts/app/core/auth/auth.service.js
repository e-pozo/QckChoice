angular.module('auth').factory('Auth',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            // create user variable
            var user = null;

            // return available functions for use in the controllers
            function isLoggedIn() {
                if (user) {
                    return true;
                }
                else {
                    return false;
                }
            }
            
            function getUserStatus() {

                return $http.get('/api/logStatus')
                // handle success
                    .then(function (obj) {
                        if(obj.data.status){
                            user = true;
                        } else {
                            user = false;
                        }
                    })
                    // handle error
                    .catch(function () {
                        user = false;
                    });
            }
            
            function login(email, password) {
                
                //create a new instance of deferred
                var deferred = $q.defer();
                
                //send a POST request to the server
                $http.post('/api/logIn', {email: email, password: password})
                // handle success
                    .then(function (data) {
                        if(data.status === 200){
                            user = true;
                            deferred.resolve();
                        }
                        else {
                            user = false;
                            deferred.reject(data);
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        user = false;
                        deferred.reject(data);
                    });
                //return promise object
                return deferred.promise;
            }
            
            function logout () {
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/api/logOut')
                // handle success
                    .then(function () {
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .catch(function (data) {
                        user = false;
                        deferred.reject(data);
                    });

                // return promise object
                return deferred.promise;
            }

            function register(userName, email, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/api/signUp',
                    {userName: userName, email: email, password: password})
                // handle success
                    .then(function (data) {
                        if(data.status === 200){
                            deferred.resolve();
                        } else {
                            deferred.reject(data);
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        deferred.reject(data);
                    });

                // return promise object
                return deferred.promise;

            }

            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register
            });

        }]);