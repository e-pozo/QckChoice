'use strict';

angular.module('voteCards')
    .component('voteCards', {
        templateUrl: 'templates/vote-cards.html',
        controller: function ($scope, $routeParams, $location, EventCore, SessionCore, Socket) {
            var saveRoutes = [
                "/session/:id/event/:eventId/voteRoom",
                "/session/:id"
            ];

            $scope.dynamicPopover = {
                content: 'Hello World',
                templateUrl: 'myPopoverTemplate.html',
                title: 'Title'
            };
            console.log($routeParams);
            $scope.models = {
                selected: null,
                lists: {"A": [], "B": []},
                reason: null
            };

            $scope.categories = [{val: 1, label: "Low"},
                {val: 2, label: "Medium"},
                {val: 3, label: "High"}];

            var choicesPromise = EventCore.listChoices();
            var eventPromise = EventCore.getThisEvent($routeParams.id,$routeParams.eventId);
            var sessionPromise = SessionCore.getThisSession($routeParams.id);
            var loadedVotes = EventCore.loadVotesOfThisEvent($routeParams.eventId);

            eventPromise
                .then(function (event) {
                    $scope.thisEvent = event.data.result;
                })
                .catch(function (err) {
                    console.log(err);
                });
            sessionPromise
                .then(function (session) {
                    $scope.thisSession = session;
                    $scope.$broadcast('isModerator', $scope.thisSession.PersonSession.isModerator);
                })
                .catch(function (err) {
                    console.log(err);
                });

            if(loadedVotes){
                $scope.models.lists = loadedVotes.voteList;
                $scope.models.reason = loadedVotes.reason;
            }
            else{
                choicesPromise
                    .then(function (choices) {
                        // Generate initial model
                        for (var choice of choices.data.result) {
                            $scope.models.lists.A.push({
                                id: choice.id,
                                name: choice.name,
                                mechanism: choice.mechanism,
                                result: choice.result,
                                priority: {val: 1, label: "Low"}});
                        }
                        // Model to JSON for demo purpose
                        $scope.$watch('models', function (model) {
                            $scope.modelAsJson = angular.toJson(model, true);
                        }, true);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }


            $scope.saveVote = function(){
                console.log($scope.models);
                EventCore.saveVote($routeParams.eventId, $scope.models.lists, $scope.models.reason);
                $location.path('/session/'+$routeParams.id);
            };

            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            //var socket = io();

            $scope.$on('$routeChangeStart', function(scope, next, current){
                if(!isInArray(next.$$route.originalPath, saveRoutes)) {
                    EventCore.resetVoteState();
                    Socket.emit('disconnectedToSession', {id: $routeParams.id, personId: JSON.parse(sessionStorage.getItem("me")).id});
                }
            });

            Socket.emit('connectedToSession', {id: $routeParams.id, personId: JSON.parse(sessionStorage.getItem("me")).id});

            Socket.on('finish:'+$routeParams.id, function () {
                console.log('Vote finished!');
            });
        }
    });