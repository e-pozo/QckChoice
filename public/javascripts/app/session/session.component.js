'use strict';

angular.module('session')
    .component('session', {
        templateUrl: 'templates/session.html',
        controller: function ($scope, $http) {
            $scope.title = "hola soy una sesion"
        }
    });