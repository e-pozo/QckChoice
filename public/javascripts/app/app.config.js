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
                        $location.path('/logIn');
                    }
                });
            return deferred.promise;
        };

        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/logIn', {
                template: "<log-in></log-in>",
                //access: {restricted: false}
            })
            .when('/signUp', {
                template: "<sign-up></sign-up>",
                //access: {restricted: false}
            })
            .when('/sessionUser', {
                template: "<header><nav-bar></nav-bar></header> <session-user></session-user>",
                resolve: {loggedIn: onlyLoggedIn}
            })
            .when('/session/:id',{
                template: "<header><nav-bar></nav-bar></header> <session></session>"
            })
            .otherwise({
                template: "<h1>404 Error, Not Found</h1>",
                //access: {restricted: false}
            })

    }]);
    /*.run(function ($rootScope, $location, $route, Auth) {
        $rootScope.$on('$routeChangeStart',
            function (event, next, current) {
                console.log(next);
                Auth.getUserStatus()
                    .then(function () {
                        if (next.access.restricted && !Auth.isLoggedIn()){
                            $location.path('/logIn');
                            $route.reload();
                        }
                    })
            });
    })*/