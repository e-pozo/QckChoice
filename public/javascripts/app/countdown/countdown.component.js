angular.module('countdown')
    .component('countdown', {
        css: ['stylesheets/countdown.css', '/scripts/clockpicker/dist/bootstrap-clockpicker.min.css'],
        templateUrl: 'templates/countdown.html',
        controller: function($scope, $routeParams, SessionCore, Socket){

            var saveRoutes = [
                "/session/:id/event/:eventId/voteRoom",
                "/session/:id"
            ]
            // Create Countdown
            var Countdown = {

                // Backbone-like structure
                $el: $('.countdown'),

                // Params
                countdown_interval: null,
                total_seconds     : 0,

                // Initialize the countdown
                init: function() {
                    // DOM
                    this.$ = {
                        hours  : this.$el.find('.bloc-time.hours .figure'),
                        minutes: this.$el.find('.bloc-time.min .figure'),
                        seconds: this.$el.find('.bloc-time.sec .figure')
                    };
                    // Init countdown values
                    var strState = localStorage.getItem("clockState");
                    console.log(strState);
                    if(strState){
                        var state = JSON.parse(strState);
                        //console.log(state);
                        this.values = state.values;
                        this.freeze = state.freeze;
                        $scope.freeze = state.freeze;
                    }
                    else{
                        this.values = {
                            hours  : this.$.hours.parent().attr('data-init-value'),
                            minutes: this.$.minutes.parent().attr('data-init-value'),
                            seconds: this.$.seconds.parent().attr('data-init-value'),
                        };
                        this.freeze = true;
                        $scope.freeze = true;
                    }
                    // Initialize total seconds
                    console.log(this.values);
                    this.total_seconds = this.values.hours * 60 * 60 + (this.values.minutes * 60) + this.values.seconds;

                    // Animate countdown to the end
                    this.count();
                },

                count: function() {

                    var that    = this,
                        $hour_1 = this.$.hours.eq(0),
                        $hour_2 = this.$.hours.eq(1),
                        $min_1  = this.$.minutes.eq(0),
                        $min_2  = this.$.minutes.eq(1),
                        $sec_1  = this.$.seconds.eq(0),
                        $sec_2  = this.$.seconds.eq(1);

                    this.countdown_interval = setInterval(function() {
                        if(!$scope.freeze) {
                            if (that.total_seconds > 0) {

                                --that.values.seconds;

                                if (that.values.minutes >= 0 && that.values.seconds < 0) {

                                    that.values.seconds = 59;
                                    --that.values.minutes;
                                }

                                if (that.values.hours >= 0 && that.values.minutes < 0) {

                                    that.values.minutes = 59;
                                    --that.values.hours;
                                }

                                // Update DOM values
                                // Hours
                                that.checkHour(that.values.hours, $hour_1, $hour_2);

                                // Minutes
                                that.checkHour(that.values.minutes, $min_1, $min_2);

                                // Seconds
                                that.checkHour(that.values.seconds, $sec_1, $sec_2);

                                --that.total_seconds;
                            }
                        }
                    }, 1000);
                },

                saveThisState: function(){
                    localStorage.setItem("clockState", JSON.stringify(this));
                },

                getTimerTime: function(){
                    return this.values.hours+':'+this.values.minutes+':'+this.values.seconds;
                },


                changeTime: function (time) {
                    var time = time.split(":");
                    this.values = {
                        hours  : parseInt(time[0]),
                        minutes: parseInt(time[1]),
                        seconds: time[2] ? parseInt(time[2]) : 0,
                    };
                    this.total_seconds = this.values.hours * 60 * 60 + (this.values.minutes * 60) + this.values.seconds;
                },

                pauseNPlayTime: function () {
                    this.freeze = !this.freeze;
                    $scope.freeze = this.freeze;
                },

                playTime: function(){
                    this.freeze = false;
                    $scope.freeze = this.freeze;
                },

                animateFigure: function($el, value) {

                    var that         = this,
                        $top         = $el.find('.top'),
                        $bottom      = $el.find('.bottom'),
                        $back_top    = $el.find('.top-back'),
                        $back_bottom = $el.find('.bottom-back');

                    // Before we begin, change the back value
                    $back_top.find('span').html(value);

                    // Also change the back bottom value
                    $back_bottom.find('span').html(value);

                    // Then animate
                    TweenMax.to($top, 0.8, {
                        rotationX           : '-180deg',
                        transformPerspective: 300,
                        ease                : Quart.easeOut,
                        onComplete          : function() {

                            $top.html(value);

                            $bottom.html(value);

                            TweenMax.set($top, { rotationX: 0 });
                        }
                    });

                    TweenMax.to($back_top, 0.8, {
                        rotationX           : 0,
                        transformPerspective: 300,
                        ease                : Quart.easeOut,
                        clearProps          : 'all'
                    });
                },

                checkHour: function(value, $el_1, $el_2) {

                    var val_1       = value.toString().charAt(0),
                        val_2       = value.toString().charAt(1),
                        fig_1_value = $el_1.find('.top').html(),
                        fig_2_value = $el_2.find('.top').html();

                    if(value >= 10) {

                        // Animate only if the figure has changed
                        if(fig_1_value !== val_1) this.animateFigure($el_1, val_1);
                        if(fig_2_value !== val_2) this.animateFigure($el_2, val_2);
                    }
                    else {

                        // If we are under 10, replace first figure with 0
                        if(fig_1_value !== '0') this.animateFigure($el_1, 0);
                        if(fig_2_value !== val_1) this.animateFigure($el_2, val_1);
                    }
                }
            };

            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            // Let's go !
            Countdown.init();
            $( window ).on('unload', function( event ) {
                Countdown.saveThisState();
            });

            $scope.switchFreeze = function () {
                SessionCore.toggleTime($routeParams.id, Countdown.getTimerTime())
                    .catch(function (err) {
                        console.log(err);
                    })
            };

            $scope.$on('isModerator', function(event,isModerator){
                $scope.isModerator = isModerator;
                if(isModerator){
                    Socket.on('getTimer:'+$routeParams.id, function () {
                        if(!$scope.freeze) {
                            Socket.emit('theTime', {time: Countdown.getTimerTime(), sessionId: $routeParams.id})
                        }
                    })
                }
                else{
                    Socket.emit('getTimer', $routeParams.id);
                }
            });

            $scope.$on('$routeChangeStart', function(scope, next, current){
                console.log("changing route");
                console.log(next.$$route.originalPath);
                if(isInArray(next.$$route.originalPath, saveRoutes)){
                    Countdown.saveThisState();
                }
                else {
                    localStorage.removeItem("clockState");
                }
            });

            //var socket = io();

            Socket.on('setTimer:'+$routeParams.id, function (time) {
                Countdown.changeTime(time);
                Countdown.playTime();
            });
            Socket.on('toggleTimer:'+$routeParams.id, function (time) {
                Countdown.changeTime(time);
                Countdown.pauseNPlayTime();
            });

            var input = $('.clockpicker').clockpicker({
                donetext: 'Done!',
                align: 'right',
                placement: 'top',
                afterDone: function(t) {
                    SessionCore.changeTime($routeParams.id, $scope.time)
                        .catch(function (err) {
                            console.log(err);
                        })
                }
            });
        }
    });