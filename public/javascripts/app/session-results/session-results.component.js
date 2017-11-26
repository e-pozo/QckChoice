'use strict';

angular.module('sessionResults')
    .component('sessionResults', {
        templateUrl: 'templates/session-results.html',
        controller: function ($scope, $q, $routeParams, $log, SessionCore, EventCore) {

            $scope.resultsLoad = false;
            var weightedCtx = document.getElementById("weightedChart");
            var frequencyCtx = document.getElementById("frequencyChart");
            var freqVeryLowPriorCtx = document.getElementById("freqVeryLowPrior");
            var freqLowPriorCtx = document.getElementById("freqLowPrior");
            var freqMediumPriorCtx = document.getElementById("freqMediumPrior");
            var freqHighPriorCtx = document.getElementById("freqHighPrior");
            var freqUrgentPriorCtx = document.getElementById("freqUrgentPrior");
            var weightedChart;
            var frequencyChart;
            var freqVeryLowPriorChart;
            var freqLowPriorChart;
            var freqMediumPriorChart;
            var freqHighPriorChart;
            var freqUrgentPriorChart;

            var colors = [
                [230, 25, 75],
                [60, 180, 75],
                [255, 225, 25],
                [0, 130, 200],
                [245, 130, 48],
                [145, 30, 180],
                [70, 240, 240],
                [240, 50, 230],
                [210, 245, 60],
                [250, 190, 190],
                [0, 128, 128],
                [230, 190, 255],
                [170, 110, 40],
                [255, 250, 200],
                [128, 0, 0],
                [170, 255, 195],
                [128, 128, 0],
                [255, 215, 180],
                [0, 0, 128],
                [128, 128, 128],
                [255, 255, 255],
                [0, 0, 0]
            ];

            EventCore.listEvent($routeParams.id)
                .then(function (events) {
                    $scope.events = events;
                })
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

            SessionCore.getThisSession($routeParams.id)
                .then(function(session){
                    var createdAt = session.createdAt.split('T');
                    session.createdAt = createdAt[0]+' , '+createdAt[1].split('.')[0]+'hrs.';
                    $scope.session = session;
                })
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

            EventCore.listChoices()
                .then(function(choices){
                    $scope.choices = choices.data.result;
                })
                .catch(function(err){
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

            $scope.getEventResults = function (sessionId, eventId) {
                EventCore.getResults(sessionId,eventId)
                    .then(function (results) {
                        $scope.resultsLoad = true;
                        $scope.selected = eventId;
                        getArguments(results);
                        getCharts(results);
                    })
                    .catch(function (err) {
                        $scope.resultsLoad = false;
                        $.notify({
                            // options
                            icon: 'glyphicon glyphicon-alert',
                            message: err
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
            
            function getArguments(results){
                var args = results
                    .map(function (result) {
                        console.log(result);
                        var Choices = result.Choices
                            .map(function (choice) {
                                console.log(choice);
                                if(choice.Vote.priority === 1) choice.Vote.priorityStr = 'Very Low';
                                if(choice.Vote.priority === 2) choice.Vote.priorityStr = 'Low';
                                if(choice.Vote.priority === 3) choice.Vote.priorityStr = 'Medium';
                                if(choice.Vote.priority === 4) choice.Vote.priorityStr = 'High';
                                if(choice.Vote.priority === 5) choice.Vote.priorityStr = 'Urgent';
                                return choice;
                            });
                        return {userName: result.Person.userName, reason:result.reason, Choices: Choices}
                    })
                    .filter(function (arg) {
                        return arg.reason !== null;
                    });
                $scope.currentPageArg = 1;

                $scope.setPage = function (pageNo) {
                    $scope.currentPageArg = pageNo;
                };

                $scope.pageChanged = function() {
                    $log.log('Page changed to: ' + $scope.currentPageArg);
                };
                $scope.itemsPerPageArg = 5;
                $scope.maxSizeArg = 10;
                $scope.totalItemsArg = args.length;
                $scope.numPageArg = Math.ceil($scope.totalItemsArg/$scope.itemsPerPageArg);
                $scope.args = args;
            }

            function getCharts(results){
                console.log(results);
                function unifyVotes(arr,vote, process,objToPush){
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].ChoiceId == vote.ChoiceId) {
                            //arr[i].weightedTotal += vote.priority;
                            process(arr[i],vote);
                            return arr;
                        }
                    }
                    arr.push(objToPush);
                    return arr;
                }

                var reducedResults = results
                    .reduce(function (votes,result) {
                        for(var i = 0; i< result.Choices.length; i++){
                             votes.push({
                                 ChoiceId: result.Choices[i].Vote.ChoiceId,
                                 name: result.Choices[i].name,
                                 mechanism: result.Choices[i].mechanism,
                                 result: result.Choices[i].result,
                                 priority: result.Choices[i].Vote.priority
                            })
                        }
                        return votes;
                    }, []);
                console.log(reducedResults);
                var weightedResults = reducedResults
                    .reduce(function (weightedResults, vote) {
                        /*function choiceIsIn(choiceId){
                            for(var i = 0; i < weightedResults.length; i++){
                                if(weightedResults[i].ChoiceId == choiceId) {
                                    weightedResults[i].weightedTotal += vote.priority;
                                    return true;
                                }
                            }
                            return false;
                        }

                        if(!choiceIsIn(vote.ChoiceId)){
                            weightedResults.push({
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                weightedTotal: vote.priority
                            })
                        }*/
                        return unifyVotes(weightedResults, vote,
                            function (voteToMod, vote) {
                                voteToMod.weightedTotal += vote.priority;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                weightedTotal: vote.priority
                            }
                        );
                    },[])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});

                var frequencyResults = reducedResults
                    .reduce(function (frequencyResults, vote) {
                        /*function choiceIsIn(choiceId){
                            for(var i = 0; i < frequencyResults.length; i++){
                                if(frequencyResults[i].ChoiceId == choiceId) {
                                    frequencyResults[i].frequency += 1;
                                    return true;
                                }
                            }
                            return false;
                        }

                        if(!choiceIsIn(reducedResults,vote.ChoiceId)){
                            frequencyResults.push({
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            })
                        }*/
                        return unifyVotes(frequencyResults,vote,
                            function (voteToMod, vote) {
                                voteToMod.frequency += 1;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            }
                        );
                    }, [])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});
                console.log(weightedResults, frequencyResults);

                var freqVeryLowResults = reducedResults
                    .filter(function(vote){return (vote.priority===1);})
                    .reduce(function (freqResults, vote) {
                        return unifyVotes(freqResults, vote,
                            function (voteToMod, vote) {
                                voteToMod.frequency += 1;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            }
                        );
                    },[])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});
                var freqLowResults = reducedResults
                    .filter(function(vote){return (vote.priority===2);})
                    .reduce(function (freqResults, vote) {
                        return unifyVotes(freqResults, vote,
                            function (voteToMod, vote) {
                                voteToMod.frequency += 1;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            }
                        );
                    },[])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});
                var freqMediumResults = reducedResults
                    .filter(function(vote){return (vote.priority===3);})
                    .reduce(function (freqResults, vote) {
                        return unifyVotes(freqResults, vote,
                            function (voteToMod, vote) {
                                voteToMod.frequency += 1;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            }
                        );
                    },[])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});
                var freqHighResults = reducedResults
                    .filter(function(vote){return (vote.priority===4);})
                    .reduce(function (freqResults, vote) {
                        return unifyVotes(freqResults, vote,
                            function (voteToMod, vote) {
                                voteToMod.frequency += 1;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            }
                        );
                    },[])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});
                var freqUrgentResults = reducedResults
                    .filter(function(vote){return (vote.priority===5);})
                    .reduce(function (freqResults, vote) {
                        return unifyVotes(freqResults, vote,
                            function (voteToMod, vote) {
                                voteToMod.frequency += 1;
                            },
                            {
                                ChoiceId: vote.ChoiceId,
                                name: vote.name,
                                mechanism: vote.mechanism,
                                result: vote.result,
                                frequency: 1
                            }
                        );
                    },[])
                    .sort(function(a,b) {return (a.ChoiceId > b.ChoiceId) ? 1 : ((b.ChoiceId > a.ChoiceId) ? -1 : 0);});
                console.log(freqVeryLowResults);

                function getAlphaColors(quantity,alpha){
                    var strColors = [];
                    for(var i = 0; i<quantity; i++){
                        strColors.push('rgba('
                            +colors[i%colors.length][0]
                            +','+colors[i%colors.length][1]
                            +','+colors[i%colors.length][2]+
                            ','+alpha+')');
                    }
                    return strColors;
                }

                if (weightedChart) weightedChart.destroy();
                weightedChart = new Chart(weightedCtx, {
                    type: 'polarArea',
                    data: {
                        labels: weightedResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'Weighted Total of Votes',
                            data: weightedResults.map(function(vote){return vote.weightedTotal}),
                            backgroundColor: getAlphaColors(weightedResults.length, '0.2'),
                            borderColor: getAlphaColors(weightedResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Weighted Results'
                        },
                        legend:{
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        }
                    }
                });
                if (frequencyChart) frequencyChart.destroy();
                frequencyChart = new Chart(frequencyCtx, {
                    type: 'doughnut',
                    data: {
                        labels: frequencyResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'Frequency of Votes',
                            data: frequencyResults.map(function(vote){return vote.frequency}),
                            backgroundColor: getAlphaColors(frequencyResults.length, '0.2'),
                            borderColor: getAlphaColors(frequencyResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Votes Frequency'
                        },
                        legend:{
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        }
                    }
                });
                if(freqVeryLowPriorChart) freqVeryLowPriorChart.destroy();
                freqVeryLowPriorChart = new Chart(freqVeryLowPriorCtx, {
                    type: 'bar',
                    data: {
                        labels: freqVeryLowResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'N° Votes',
                            data: freqVeryLowResults.map(function(vote){return vote.frequency}),
                            backgroundColor: getAlphaColors(freqVeryLowResults.length, '0.2'),
                            borderColor: getAlphaColors(freqVeryLowResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'N° of Votes with Very Low Priority'
                        },
                        legend:{
                            display: false,
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                }
                            }]
                        }
                    }
                });
                if(freqLowPriorChart) freqLowPriorChart.destroy();
                freqLowPriorChart = new Chart(freqLowPriorCtx, {
                    type: 'bar',
                    data: {
                        labels: freqLowResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'N° Votes:',
                            data: freqLowResults.map(function(vote){return vote.frequency}),
                            backgroundColor: getAlphaColors(freqLowResults.length, '0.2'),
                            borderColor: getAlphaColors(freqLowResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'N° of Votes with Low Priority'
                        },
                        legend:{
                            display: false,
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                }
                            }]
                        }
                    }
                });
                if(freqMediumPriorChart) freqMediumPriorChart.destroy();
                freqMediumPriorChart = new Chart(freqMediumPriorCtx, {
                    type: 'bar',
                    data: {
                        labels: freqMediumResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'N° Votes:',
                            data: freqMediumResults.map(function(vote){return vote.frequency}),
                            backgroundColor: getAlphaColors(freqMediumResults.length, '0.2'),
                            borderColor: getAlphaColors(freqMediumResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'N° of Votes with Medium Priority'
                        },
                        legend:{
                            display: false,
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                }
                            }]
                        }
                    }
                });
                if(freqHighPriorChart) freqHighPriorChart.destroy();
                freqHighPriorChart = new Chart(freqHighPriorCtx, {
                    type: 'bar',
                    data: {
                        labels: freqHighResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'N° Votes:',
                            data: freqHighResults.map(function(vote){return vote.frequency}),
                            backgroundColor: getAlphaColors(freqHighResults.length, '0.2'),
                            borderColor: getAlphaColors(freqHighResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'N° of Votes with High Priority'
                        },
                        legend:{
                            display: false,
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                }
                            }]
                        }
                    }
                });
                if(freqUrgentPriorChart) freqUrgentPriorChart.destroy();
                freqUrgentPriorChart = new Chart(freqUrgentPriorCtx, {
                    type: 'bar',
                    data: {
                        labels: freqUrgentResults.map(function (vote) {return vote.name}),
                        datasets: [{
                            label: 'N° Votes:',
                            data: freqUrgentResults.map(function(vote){return vote.frequency}),
                            backgroundColor: getAlphaColors(freqUrgentResults.length, '0.2'),
                            borderColor: getAlphaColors(freqUrgentResults.length, '1'),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'N° of Votes with Urgent Priority'
                        },
                        legend:{
                            display: false,
                            position: 'bottom',
                            onClick: function (e, legendItem) {
                                console.log('click',e, legendItem);
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                }
                            }]
                        }
                    }
                });
            }
        }
    });