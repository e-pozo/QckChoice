'use strict';

angular.module('sessionEvents')
    .component('sessionEvents', {
        templateUrl: 'templates/events.html',
        controller: function ($scope, $q, $routeParams, $uibModal, SessionCore, EventCore) {
            $scope.inTheZone = false;

            var modalCreate;
            var modalEdit;

            SessionCore.validateSession($routeParams.id).then(function (resultado) {
                $scope.inTheZone = true;
                $scope.thisSession =resultado;

            }).catch(function (error) {
                $scope.errorMessage = error;
                $scope.error = true;
            });
            
            var listEvent = function () {
                EventCore.listEvent($routeParams.id).then(function (resultado) {
                    $scope.events = resultado;
                })
            };


            $scope.event = {'objective': null, 'timer':null};
            listEvent();

            var eventValidation = function () {
                var deferred = $q.defer();
                if($scope.event.objective){
                    deferred.resolve();
                }else{
                    deferred.reject("Events need an Objetive");
                }
                return deferred.promise;
            };

            $scope.openModalCreate = function () {
                $scope.strAction = 'Create';
                modalCreate = $uibModal.open({
                    templateUrl: 'templates/event-modal-create.html',
                    scope: $scope
                })
            };

            $scope.openModalEdit = function(event) {
                $scope.strAction = 'Edit';
                $scope.event = event;
                modalEdit = $uibModal.open({
                    templateUrl: 'templates/event-modal-create.html',
                    scope: $scope
                })
            };

            $scope.closeModal = function(){
                if(modalCreate){
                    modalCreate.close();
                }
                else {
                    modalEdit.close();
                }
            };

            $scope.newEvent = function() {
                eventValidation()
                    .then(function () {
                        EventCore.makeEvent($routeParams.id, $scope.event.objective)
                            .then(function (successMsg) {
                                console.log(successMsg);
                                $scope.closeModal();
                                listEvent();
                            })
                            .catch(function (err) {
                                console.log(err);
                                $scope.errorMessage = err;
                                $scope.error = true;
                                $scope.event = null;
                                $scope.closeModal();
                            })

                    })
                    .catch(function(errorMsg){
                        console.log(errorMsg);
                        $scope.errorMessage = errorMsg;
                        $scope.error = true;
                        $scope.event = null;
                        $scope.closeModal()
                    });
            };

            $scope.editEvent = function () {
                eventValidation()
                    .then(function () {
                        console.log($scope.event);
                        EventCore.updateEvent($scope.thisSession.id,$scope.event.id, $scope.event.objective)
                            .then(function (result) {
                                console.log(result);
                                $scope.closeModal();
                                listEvent();
                            })
                            .catch(function (err) {
                                console.log(err);
                                $scope.errorMessage = err;
                                $scope.error = true;
                                $scope.closeModal();

                            })
                    })
                    .catch(function (errorMsg) {
                        console.log(errorMsg);
                        $scope.errorMessage = errorMsg;
                        $scope.error = true;
                        $scope.closeModal();
                    })
            };

            $scope.delete = function (event) {
                if(confirm("Are you sure to delete this event")){
                    EventCore.deleteEvent($scope.thisSession.id, event.id)
                        .then(function (result) {
                            listEvent();
                            console.log(result);
                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                }
                else{
                    console.log("The user rejeted this delete");
                }
            };

            $scope.closeError = function () {
                $scope.error = false;
            }
        }
    });