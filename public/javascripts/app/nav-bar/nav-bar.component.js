'use strict';

angular.module('navBar')
    .component('navBar', {
        templateUrl: 'templates/nav-bar.html',
        controller: function ($scope, $q, Auth, $location) {
            $scope.logged = Auth.isLoggedIn()
            $scope.logOut = function () {
                //call logOut from service
                Auth.logout()
                    .then(function () {
                        $location.path('/welcome');
                    })
            }
        }
    });