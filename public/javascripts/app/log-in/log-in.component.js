'use strict';

angular.module('logIn')
    .component('logIn', {
       templateUrl: 'templates/log-in.html',
           controller: function($scope, $q, $location, Auth){
           var validation = function () {
               var deferred = $q.defer();
               if($scope.person != null ){
                   console.log($scope.person)
                   if($scope.person.email != null && $scope.person.password!= null) {
                       deferred.resolve();
                   }
                   else{
                       deferred.reject("Please fill all fields.");
                   }
               }
               else{
                   deferred.reject("Please fill all fields.");
               }
               return deferred.promise;
           };
           console.log(Auth.urltemp)
           $scope.person = {'email': null, 'password':null}
           $scope.logIn = function () {

               // initial values
               $scope.error = false;
               $scope.disabled = true;

               validation()
                   .then(function () {
                           // call login from service
                           Auth.login($scope.person.email, $scope.person.password)
                           // handle success
                               .then(function () {
                                   if(Auth.urltemp){
                                       $location.path(Auth.urltemp);
                                   }else{
                                       $location.path('/welcome');
                                   }
                                   $scope.disabled = false;
                                   $scope.person = null;
                               })
                               // handle error
                               .catch(function (inf) {
                                   $scope.error = true;
                                   $scope.errorMessage = inf.data.err.message;
                                   $scope.disabled = false;
                                   $scope.person = null;
                               })

                   })
                   .catch(function (errorMs) {
                       $scope.error = true;
                       $scope.errorMessage = errorMs;
                       $scope.disabled = false;
                       $scope.person = null;
                   })

           };

           $scope.closeError = function () {
               $scope.error = false;
           }
       }
    });