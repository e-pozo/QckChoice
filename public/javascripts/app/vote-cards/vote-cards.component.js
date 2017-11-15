'use strict';

angular.module('voteCards')
    .component('voteCards', {
        templateUrl: 'templates/vote-cards.html',
        controller: function ($scope, $routeParams, $location, EventCore) {
            $scope.dynamicPopover = {
                content: 'Hello World',
                templateUrl: 'myPopoverTemplate.html',
                title: 'Title'
            };
            console.log($routeParams);
            $scope.models = {
                selected: null,
                lists: {"A": [], "B": []}
            };

            $scope.categories = [{val: 1, label: "Very Low"},
                {val: 2, label: "Low"},
                {val: 3, label: "Medium"},
                {val: 4, label: "High"},
                {val: 5, label: "Urgent"}];

            var choicesPromise = EventCore.listChoices();
            var eventPromise = EventCore.getThisEvent($routeParams.id,$routeParams.eventId);
            var loadedVotes = EventCore.loadVotesOfThisEvent($routeParams.eventId);

            eventPromise
                .then(function (event) {
                    console.log(event.data.result);
                    $scope.thisEvent = event.data.result;
                })
                .catch(function (err) {
                    console.log(err);
                });

            if(loadedVotes){
                $scope.models.lists = loadedVotes;
            }
            else{
                choicesPromise
                    .then(function (choices) {
                        console.log(choices.data.result);
                        // Generate initial model
                        for (var choice of choices.data.result) {
                            console.log(choice);
                            $scope.models.lists.A.push({name: choice.name,
                                mechanism: choice.mechanism,
                                result: choice.result,
                                priority: {val: 1, label: "Very Low"}});
                        }
                        console.log("reading controller");
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
                EventCore.saveVote($routeParams.eventId, $scope.models.lists);
                $location.path('/session/'+$routeParams.id);
            }
        }
    });