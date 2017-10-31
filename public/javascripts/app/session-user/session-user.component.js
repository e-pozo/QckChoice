'use strict';

angular.module('sessionUser')
    .component('sessionUser', {
       templateUrl: 'templates/session-user.html',
       controller: function ($scope, $q ,$http, Session) {
           ///jsonexample/package.json
           var getSessions = function () {
               console.log("esto")
               $http.get('/api/sessionUser')
                   .then(function (result, status) {
                       console.log(result.data)
                       $scope.sessions= result.data;
                   })
                   .catch(function (err, status) {
                       console.log(err);
                   })
           };

           getSessions();

           $scope.thisSession = {'title': null, 'description': null};

           var sessionvalidation = function () {
               var deferred = $q.defer();
               if($scope.thisSession.title!= null){
                   deferred.resolve()
               }else{
                   deferred.reject("Sessions need a Title")
               }
               return deferred.promise;
           };

           $scope.newSession = function() {
               sessionvalidation()
                   .then(function () {
                       Session.createSession($scope.session.title, $scope.session.description)
                           .then(function () {
                               getSessions();
                           })
                           .catch(function (inf) {
                               $scope.errorMessage = inf.data.err.message;
                               $scope.error = true;
                               $scope.session = null;
                           })

                   })
                   .catch(function(errorMs){
                       $scope.errorMessage = errorMs;
                       $scope.error = true;
                       $scope.session = null;

                   });

           };

           $scope.closeError = function () {
               console.log("close")
               $scope.error = false;
           }
       }
    });