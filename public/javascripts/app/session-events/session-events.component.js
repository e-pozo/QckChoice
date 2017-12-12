'use strict';

angular.module('sessionEvents')
    .component('sessionEvents', {
        templateUrl: 'templates/events.html',
        css: ['stylesheets/scrolldown.css'],
        controller: function ($scope, $q, $routeParams, $uibModal, $location, SessionCore, EventCore, Socket, $translate) {
            var saveRoutes = [
                "/session/:id/event/:eventId/voteRoom",
                "/session/:id"
            ];

            var peopleOnline=[];

            $scope.quantOfPeopleWhoVoted = 0;
            $scope.inTheZone = false;
            //var socket = io();
            Socket.emit('connectedToSession', {id: $routeParams.id, personId: JSON.parse(sessionStorage.getItem("me")).id});
            Socket.on('usersConnected:'+$routeParams.id, function (people) {
                console.log(people[0].personIds);
                peopleOnline = people[0].personIds;
                $scope.peopleOnline = people[0].personIds;
                SessionCore.listParticipants($routeParams.id)
                    .then(function(participants){
                        return participants.map(function(participant){
                            if($scope.peopleOnline.indexOf(participant.id) > -1){
                                participant.isOnline = true;
                            }
                            else{
                                participant.isOnline = false;
                            }
                            return participant;
                        });
                    })
                    .then(function(participants){
                        SessionCore.getPeopleWhoVote($routeParams.id)
                            .then(function (peopleWhoVote) {
                                $scope.quantOfPeopleWhoVoted = peopleWhoVote.length;
                                $scope.participants = participants.map(function(participant){
                                    if(peopleWhoVote.indexOf(participant.id) > -1){
                                        participant.alreadyVote = true;
                                    }
                                    else{
                                        participant.alreadyVote = false;
                                    }
                                    return participant;
                                })
                            })
                            .catch(function (err){
                                console.log(err);
                            });
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                $scope.$apply();
            });

            Socket.on('updatePeopleReady:'+$routeParams.id, function(){
                SessionCore.getPeopleWhoVote($routeParams.id)
                    .then(function (peopleWhoVote) {
                        $scope.quantOfPeopleWhoVoted = peopleWhoVote.length;
                        $scope.participants = $scope.participants.map(function(participant){
                            if(peopleWhoVote.indexOf(participant.id) > -1){
                                participant.alreadyVote = true;
                            }
                            else{
                                participant.alreadyVote = false;
                            }
                            return participant;
                        })
                    })
                    .catch(function (err){
                        console.log(err);
                    });
            });

            Socket.on('finish:'+$routeParams.id, function () {
                $location.path('/session/'+$routeParams.id+'/results');
            });
            Socket.on('updateEvents:'+$routeParams.id,function () {
                listEvent();
            });

            var modalCreate;
            var modalEdit;
            SessionCore.getThisSession($routeParams.id).then(function (resultado) {
                $scope.inTheZone = true;
                $scope.thisSession =resultado;
                $scope.$broadcast('isModerator', $scope.thisSession.PersonSession.isModerator);

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

            $scope.sendVotes = function () {
                EventCore.sendVotes($routeParams.id, EventCore.loadVotes())
                    .then(function (values) {
                        console.log(values);
                        $translate('SESSION_ROOM.SEND_VOTES_MSG')
                            .then(function (msg) {
                                $.notify({
                                    // options
                                    icon: 'glyphicon glyphicon-ok-sign',
                                    message: msg
                                },{
                                    // settings
                                    type: 'success',
                                    animate: {
                                        enter: 'animated fadeInDown',
                                        exit: 'animated fadeOutUp'
                                    }
                                });
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                        $.notify({
                            // options
                            icon: 'glyphicon glyphicon-alert',
                            message: 'You have already voted!, if you want vote again, please talk with session creator'
                        },{
                            // settings
                            type: 'danger',
                            delay: 5000,
                            timer: 1000,
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            }
                        });
                    })
            };


            $scope.finishSession = function () {
                SessionCore.finishSession($routeParams.id)
                    .catch(function (err) {
                        console.log(err);
                        $.notify({
                            // options
                            icon: 'glyphicon glyphicon-alert',
                            message: err.data
                        },{
                            // settings
                            type: 'danger',
                            delay: 5000,
                            timer: 1000,
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            }
                        });
                    });
            };

            $scope.closeError = function () {
                $scope.error = false;
            };

            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            $scope.$on('$routeChangeStart', function(scope, next, current){
                if(!isInArray(next.$$route.originalPath, saveRoutes)) {
                    EventCore.resetVoteState();
                    Socket.emit('disconnectedToSession', {id: $routeParams.id, personId: JSON.parse(sessionStorage.getItem("me")).id});
                }
            });
        }
    });