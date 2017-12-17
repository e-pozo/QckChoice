'use strict';

var  logIn = angular.module('logInForDelivery', ["auth","personCore"]);

logIn.controller('logInController', function ($scope, $q, $location, Auth, PersonCore, $translate) {
    var validation = function () {
        var deferred = $q.defer();
        if($scope.person != null ){
            console.log($scope.person)
            if($scope.person.email != null && $scope.person.password!= null) {
                deferred.resolve();
            }
            else{
                deferred.reject("Please fill all fields.");
            }
        }
        else{
            deferred.reject("Please fill all fields.");
        }
        return deferred.promise;
    };
    console.log(Auth.urltemp);
    $scope.person = {'email': null, 'password':null};
    $scope.logIn = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        validation()
            .then(function () {
                // call login from service
                Auth.login($scope.person.email, $scope.person.password)
                // handle success
                    .then(function () {
                        if(Auth.urltemp){
                            $location.path(Auth.urltemp);
                        }else{
                            $location.path('/sessionUser');
                        }
                        $scope.disabled = false;
                        $scope.person = null;
                        PersonCore.aboutMe()
                            .then(function (me) {
                                sessionStorage.setItem('me',JSON.stringify(me))
                            })
                    })
                    // handle error
                    .catch(function (inf) {
                        $scope.error = true;
                        $scope.errorMessage = inf.data.err.message;
                        $scope.disabled = false;
                        $scope.person = null;
                    })

            })
            .catch(function (errorMs) {
                $scope.error = true;
                $scope.errorMessage = errorMs;
                $scope.disabled = false;
                $scope.person = null;
            })

    };

    $scope.closeError = function () {
        $scope.error = false;
    };

    $scope.loginAsAnonymous = function () {
        Auth.loginAsAnonymous()
            .then(function () {
                $location.path('/sessionUser');
                $scope.disabled = false;
                $scope.person = null;
                PersonCore.aboutMe()
                    .then(function (me) {
                        sessionStorage.setItem('me',JSON.stringify(me))
                    })
            })
            .catch(function (inf) {
                $scope.error = true;
                $scope.errorMessage = inf.data.err.message;
                $scope.disabled = false;
                $scope.person = null;
            })
    };

    $scope.facebookLogIn = function() {
        Auth.facebookLogIn()
    }
});