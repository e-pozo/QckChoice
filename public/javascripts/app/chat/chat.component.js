'use strict';

angular.module('chat')
    .component('chat', {
        templateUrl: 'templates/chat.html',
        controller: function ($scope, $routeParams, EventCore, Socket, $translate) {
            var chatPromise = EventCore.listMessageToChat($routeParams.id, $routeParams.eventId);
            $scope.isChat = true;
            $scope.toggleMinim = function () {
                console.log('toggle');
                var $this = $('#minim_chat_window');
                if (!$this.hasClass('panel-collapsed')) {
                    $this.parents('.panel').find('.panel-body').slideUp();
                    $this.addClass('panel-collapsed');
                    $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
                } else {
                    $this.parents('.panel').find('.panel-body').slideDown();
                    $this.removeClass('panel-collapsed');
                    $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                }
            };

            $(document).on('focus', '.panel-footer input.chat_input', function (e) {
                var $this = $(this);
                if ($('#minim_chat_window').hasClass('panel-collapsed')) {
                    $this.parents('.panel').find('.panel-body').slideDown();
                    $('#minim_chat_window').removeClass('panel-collapsed');
                    $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
                }
            });
            $(document).on('click', '#new_chat', function (e) {
                var size = $(".chat-window:last-child").css("margin-left");
                var size_total = parseInt(size) + 400;
                alert(size_total);
                var clone = $("#chat_window_1").clone().appendTo(".container");
                clone.css("margin-left", size_total);
            });
            $(document).on('click', '.icon_close', function (e) {
                //$(this).parent().parent().parent().parent().remove();
                $("#chat_window_1").remove();
            });

            //var socket = io();
            var output = document.getElementById('output');
            var aboutMe = JSON.parse(sessionStorage.getItem('me'));
            var msgHTML = function (userName, msg, type) {
                if (type === 'sent'){
                    return `<div class="row msg_container base_sent">
                                            <div class="col-md-10 col-xs-10">
                                                <div class="messages msg_sent">
                                                    <p>${msg}</p>
                                                    <time datetime="2009-11-13T20:00">${userName}</time>
                                                </div>
                                            </div>
                                            <div class="col-md-2 col-xs-2 avatar">
                                                <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
                                            </div>
                                        </div>`;
                }
                else{
                    return `<div class="row msg_container base_receive">
                                    <div class="col-md-2 col-xs-2 avatar">
                                        <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
                                    </div>
                                    <div class="col-md-10 col-xs-10">
                                        <div class="messages msg_receive">
                                            <p>${msg}</p>
                                            <time datetime="2009-11-13T20:00">${userName}</time>
                                        </div>
                                    </div>
                                </div>`;
                }
            }

            $scope.sendMsg = function () {
                EventCore.addMessageToChat($routeParams.id, $routeParams.eventId, $scope.chat.message)
                    .then(function () {
                         output.innerHTML += msgHTML(aboutMe.userName, $scope.chat.message, 'sent');
                        Socket.emit('chat message', {event: $routeParams.eventId, message: $scope.chat.message, userName: aboutMe.userName});
                        $scope.chat.message = null;
                    })
            };

            Socket.on('chat message'+$routeParams.eventId, function (msg) {
                output.innerHTML += msgHTML(msg.userName, msg.message, 'receive');
            });

            chatPromise
                .then(function (messages) {
                    console.log(messages.data.result);
                    for(var msg of messages.data.result){
                        if(msg.Person.id === aboutMe.id){
                            output.innerHTML += msgHTML(msg.Person.userName, msg.message, 'sent');
                        }
                        else{
                            output.innerHTML += msgHTML(msg.Person.userName, msg.message, 'receive');
                        }
                    }
                });
        }
    });