'use strict';

angular.module('sessionUser')
    .component('sessionUser', {
       templateUrl: 'templates/session-user.html',
       controller: function ($scope, $q ,$http, Auth, SessionCore) {
           ///jsonexample/package.json
           /*var getSessions = function () {
               console.log("esto")
               $http.get('/api/sessionUser')
                   .then(function (result, status) {
                       console.log(result.data)
                       $scope.sessions= result.data;
                   })
                   .catch(function (err, status) {
                       console.log(err);
                   })
           };*/
           var getSessions = function () {
               SessionCore.getSessions()
                   .then(function (sessions) {
                       $scope.sessions = sessions;
                   })
                   .catch(function (err) {
                       console.log(err);
                   });
           };

           getSessions();

           $scope.session = {'title': null, 'description': null};

           var sessionvalidation = function () {
               var deferred = $q.defer();
               if($scope.session.title != null){
                   deferred.resolve();
               }else{
                   deferred.reject("Sessions need a Title");
               }
               return deferred.promise;
           };

           $scope.newSession = function() {
               sessionvalidation()
                   .then(function () {
                       SessionCore.createSession($scope.session.title, $scope.session.description)
                           .then(function (successMsg) {
                               console.log(successMsg);
                               getSessions();

                           })
                           .catch(function (err) {
                               $scope.errorMessage = err;
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