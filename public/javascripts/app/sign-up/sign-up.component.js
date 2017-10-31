'use strict';

angular.module('signUp')
    .component('signUp', {
        templateUrl: 'templates/sign-up.html',
        controller: function($scope, $location, Auth, $q){
            var validation = function () {
                var deferred = $q.defer();

                if($scope.person.email != null && $scope.person.userName!= null && $scope.person.password!= null && $scope.person.passwordRepeat!= null) {
                    if ($scope.person.password == $scope.person.passwordRepeat) {
                        deferred.resolve();
                    } else {
                        deferred.reject("Sorry dude, but your passwords do not match");
                    }
                }
                else{

                    deferred.reject("Please fill all fields.");
                }

                return deferred.promise;
            };

            $scope.person = {'email': null,'userName':null, 'password':null, 'passwordRepeat':null}
            $scope.signUp = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                validation()
                    .then(function () {
                        // call register from service
                        Auth.register($scope.person.userName, $scope.person.email, $scope.person.password)
                        // handle success
                            .then(function () {
                                $location.path('/sessionUser');
                                $scope.disabled = false;
                                $scope.person = {};
                            })
                            // handle error
                            .catch(function (inf) {
                                $scope.error = true;
                                $scope.errorMessage = inf.data.err.message;
                                $scope.disabled = false;
                                $scope.person = {};
                            });
                    })
                    .catch(function(errorMs){
                        $scope.errorMessage = errorMs;
                        $scope.error = true;
                        $scope.disabled = false;
                        $scope.person = null;
                    });
            };

            $scope.closeError = function () {
                console.log("close")
                $scope.error = false;
            }

        }
    });