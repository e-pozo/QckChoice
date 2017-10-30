'use strict';

angular.module('sessionUser')
    .component('sessionUser', {
       templateUrl: 'templates/session-user.html',
       controller: function ($scope, $http) {
           console.log("hello");
           var getSessions = function () {
               $http.get('/api/sessionUser')
                   .then(function (result, status) {
                       console.log(result.data);
                   })
                   .catch(function (err, status) {
                       console.log(err);
                   })
           };
           getSessions();
       }
    });