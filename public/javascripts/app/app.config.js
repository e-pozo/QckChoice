'use strict';

angular.module('QckChoice')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        var onlyLoggedIn = function ($location, $q, Auth) {
            console.log("onlyLoggedIn");
            var deferred = $q.defer();
            Auth.getUserStatus()
                .then(function () {
                    if (Auth.isLoggedIn()){
                        console.log("fireLogged");
                        deferred.resolve();
                    }
                    else{
                        deferred.reject();
                        Auth.urltemp = $location.url();
                        $location.path('/welcome');
                    }
                });
            return deferred.promise;
        };

        var onlyLoggedInSession = function ($location, $q, Auth) {
            var deferred = $q.defer();
            Auth.getUserStatus()
                .then(function () {
                    if (Auth.isLoggedIn()){
                        console.log("fireLogged");
                        deferred.resolve();
                    }
                    else{
                        deferred.reject();
                        Auth.urltemp = $location.url();
                        $location.path('/logIn');
                    }
                });
            return deferred.promise;
        };

        var joinAtSession = function ($location, $route, $q, Auth, SessionCore) {
            var deferred = $q.defer();
            var paramsObj = $route.current.params;
            console.log(paramsObj);
            deferred.resolve();
            Auth.getUserStatus()
                .then(function(){
                    if (Auth.isLoggedIn()){
                        SessionCore.inviteToSession(paramsObj.id, paramsObj.keypass)
                            .then( function (result) {
                                console.log(result);
                                Auth.urltemp = null;
                                $location.path('/session/'+paramsObj.id);
                                deferred.resolve();
                            })
                            .catch(function (err) {
                                Auth.urltemp = $location.url();
                                console.log(err);
                                deferred.reject();
                            })
                    }
                    else{
                        Auth.urltemp = $location.url();
                        $location.path('/logIn');
                        deferred.reject();
                    }
                })
                .catch(function () {
                    Auth.urltemp = $location.url();
                    $location.path('/logIn');
                    deferred.reject();
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
                        console.log('unlogged');
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
                    resolve: {invloggedIn: inverseLoggedIn}
            })
            .when('/signUp', {
                template: "<sign-up></sign-up>",
                resolve: {loggedIn: inverseLoggedIn}
            })
            .when('/session/:id/join/:keypass', {
                template: "<header><nav-bar></nav-bar></header>",
                resolve: {join: joinAtSession}
            })
            .when('/sessionUser', {
                template: "<header><nav-bar></nav-bar></header> <session-user></session-user>",
                resolve: {loggedIn: onlyLoggedIn}

            })
            .when('/session/:id/event/:eventId/voteRoom', {
                template: "<header><nav-bar></nav-bar></header> <vote-cards></vote-cards>",
                resolve: {loggedIn: onlyLoggedIn}
            })
            .when('/session/:id', {
                template: "<header><nav-bar></nav-bar></header> <session-events><h1></h1></session-events>",
                resolve: {loggedIn: onlyLoggedInSession}
            })

            .otherwise({
                template: "<h1>404 Error, Not Found</h1>",
            })

    }]);