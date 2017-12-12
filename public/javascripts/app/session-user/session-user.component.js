'use strict';

angular.module('sessionUser')
    .component('sessionUser', {
       templateUrl: 'templates/session-user.html',
       controller: function ($scope, $q ,$http, Auth, SessionCore, $uibModal, $translate) {
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
           var modalCreate;
           var modalEdit;

           $scope.openModalCreate = function () {
               $scope.strAction = "Create";
               modalCreate = $uibModal.open({
                   templateUrl: 'templates/session-modal-create.html',
                   scope: $scope
               })
           };

           $scope.openModalEdit = function (sessionData) {
               $scope.strAction = "Edit";
               $scope.session = sessionData;
               modalEdit = $uibModal.open({
                   templateUrl: 'templates/session-modal-create.html',
                   scope: $scope
               })
           };

           $scope.closeModal = function () {
               if(modalCreate){
                   modalCreate.close()
               }
               if(modalEdit){
                   modalEdit.close()
               }
           };

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
                               $scope.closeModal();

                           })
                           .catch(function (err) {
                               $scope.closeModal();
                               $scope.errorMessage = err;
                               $scope.error = true;
                               $scope.session = null;
                           })

                   })
                   .catch(function(errorMs){
                       $scope.closeModal();
                       $scope.errorMessage = errorMs;
                       $scope.error = true;
                       $scope.session = null;

                   });

           };

           $scope.editSession = function () {
               sessionvalidation()
                   .then(function () {
                       SessionCore.updateSession($scope.session.id, $scope.session.title, $scope.session.description)
                           .then(function (succesMsg) {
                               console.log(succesMsg);
                               getSessions();
                               $scope.closeModal();
                           })
                           .catch(function (err) {
                               $scope.closeModal();
                               $scope.errorMessage = err;
                               $scope.error = true;
                           })
                   })
                   .catch(function (err){
                       $scope.closeModal();
                       $scope.errorMessage = err;
                       $scope.error = true;
                   })
           };
            
           $scope.delete = function (session) {
               if(confirm("Are you sure to delete this session?")){
                   SessionCore.deleteSession(session.id)
                       .then(function(successMsg){
                           console.log(successMsg);
                           getSessions();
                       })
                       .catch(function (err) {
                           console.log(err);
                           $scope.errorMessage = err;
                           $scope.error = true;

                       })
               }
               else{
                   console.log("the user pressed cancel");
               }

           };

           $scope.closeError = function () {
               console.log("close");
               $scope.error = false;
           }
       }
    });