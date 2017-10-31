'use strict';

angular.module('QckChoice')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        var onlyLoggedIn = function ($location, $q, Auth) {
            var deferred = $q.defer();
            Auth.getUserStatus()
                .then(function () {
                    if (Auth.isLoggedIn()){
                        console.log("fireLogged");
                        deferred.resolve();
                    }
                    else{
                        deferred.reject();
                        $location.path('/welcome');
                    }
                });
            return deferred.promise;
        };

        var inverseLoggedIn = function ($location, $q, Auth) {
            var deferred = $q.defer();
            Auth.getUserStatus()
                .then(function () {
                    if (Auth.isLoggedIn()){
                        $location.path('/sessionUser');
                        deferred.reject();
                    }
                    else{
                        deferred.resolve();
                        console.log('unlogged')
                    }
                });
            return deferred.promise;
        };

        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/welcome',{
                template: "<header><nav-bar></nav-bar></header> <welcome><h1>hola</h1></welcome>"
            })
            .when('/logIn', {
                template: "<log-in></log-in>",
                    resolve: {loggedIn: inverseLoggedIn}
            })
            .when('/signUp', {
                template: "<sign-up></sign-up>",
                resolve: {loggedIn: inverseLoggedIn}
            })
            .when('/sessionUser', {
                template: "<header><nav-bar></nav-bar></header> <session-user></session-user>",
                resolve: {loggedIn: onlyLoggedIn}

            })
            .when('/session/:id', {
                template: "<header><nav-bar></nav-bar></header> <session><h1></h1></session>",
                resolve: {loggedIn: onlyLoggedIn}
            })
            .otherwise({
                template: "<h1>404 Error, Not Found</h1>",
            })

    }]);