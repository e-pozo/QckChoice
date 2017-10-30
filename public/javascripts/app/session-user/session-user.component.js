'use strict';

angular.module('sessionUser')
    .component('sessionUser', {
       templateUrl: 'templates/session-user.html',
       controller: function ($scope, $http) {
           ///jsonexample/package.json
           var getSessions = function () {
               $http.get('/api/sessionUser')
                   .then(function (result, status) {
                       $scope.sessions= result.data;
                   })
                   .catch(function (err, status) {
                       console.log(err);
                   })
           };
           getSessions();
       }
    });