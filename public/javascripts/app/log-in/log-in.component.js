'use strict';

angular.module('logIn')
    .component('logIn', {
       templateUrl: 'templates/log-in.html',
       controller: function($scope, $location, Auth){
           $scope.logIn = function () {

               // initial values
               $scope.error = false;
               $scope.disabled = true;

               // call login from service
               Auth.login($scope.person.email, $scope.person.password)
               // handle success
                   .then(function () {
                       $location.path('/sessionUser');
                       $scope.disabled = false;
                       $scope.person = {};
                   })
                   // handle error
                   .catch(function (inf) {
                       $scope.error = true;
                       $scope.errorMessage = inf.data.err.message;
                       $scope.disabled = false;
                       $scope.person = {};
                   });

           };

           $scope.closeError = function () {
               $scope.error = false;
           }
       }
    });