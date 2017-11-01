'use strict';

angular.module('session')
    .component('session', {
        templateUrl: 'templates/session.html',
        controller: function ($scope, $routeParams) {
            $scope.id = $routeParams.id;
            $scope.event = {'objetive': null, 'timer':null}

        }
    });