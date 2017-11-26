'use strict';

angular.module('session')
    .component('session', {
        templateUrl: 'templates/session.html',
        controller: function ($scope, $q, $routeParams, SessionCore, EventCore) {
            $scope.inTheZone = false;
            $scope.id = $routeParams.id;

            SessionCore.validateSession($scope.id).then(function (resultado) {
                $scope.inTheZone = true;
                $scope.thisSession =resultado;

            }).catch(function (error) {
                $scope.errorMessage = error;
            })
            
            var listEvent = function () {
                EventCore.listEvent($scope.id).then(function (resultado) {
                    $scope.events = resultado;
                })
            }


            $scope.event = {'objective': null, 'timer':null}
            listEvent()

            var eventValidation = function () {
                var deferred = $q.defer();
                if($scope.event.objective != null){
                    deferred.resolve();
                }else{
                    deferred.reject("Events need an Objetive");
                }
                return deferred.promise;
            };

            $scope.newEvent = function() {
                eventValidation()
                    .then(function () {
                        EventCore.makeEvent($scope.id, $scope.event.objective)
                            .then(function (successMsg) {
                                console.log(successMsg);
                                listEvent()
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
                $scope.errorMessage = false;
            }
        }
    });