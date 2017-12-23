'use strict';

angular.module('welcome')
    .component('welcome', {
        templateUrl: 'templates/welcome.html',
        css: 'stylesheets/one-page-wonder.css',
        controller: function ($scope, $translate, $rootScope) {
            $scope.lang = $translate.use();
            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.lang = $translate.use();
            })
        }
    });