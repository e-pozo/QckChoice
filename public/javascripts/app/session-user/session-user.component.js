'use strict';

angular.module('sessionUser')
    .component('sessionUser', {
       templateUrl: 'templates/session-user.html',
       controller: function ($http, $scope) {
           var getSessions = function () {
               //jsonexample/package.json
               $http.get('/api/sessionUser')
                   .then(function(response, status, config, statusText) {
                       var sessions = response.data;
                       $scope.sessions   = sessions;
                       console.log(response)
                   })
                   .catch(function (response, status, config, statusText) {

                   })
           };
           getSessions();
       }
    });