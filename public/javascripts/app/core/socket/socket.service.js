angular.module('socket')
    .factory('Socket',function () {
        return io();
    });