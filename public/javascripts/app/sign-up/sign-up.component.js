'use strict';

angular.module('signUp')
    .component('signUp', {
        templateUrl: 'templates/sign-up.html',
        controller: function($scope, $location, Auth, $q){
            var validation = function () {
                return $q(function (resolve, reject) {
                    if($scope.person.password == $scope.person.passwordRepeat){
                        resolve();

                    }
                    else{
                        reject("Sorry dude, but your passwords do not match");
                    }

                })


            };

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
                        $scope.person = {};
                    });

            };

            $scope.closeError = function () {
                $scope.error = false;
            }

        }
    });