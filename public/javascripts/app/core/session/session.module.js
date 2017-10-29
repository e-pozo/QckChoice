angular.module('session')
    .factory('Session', function ($resource) {
        var url = '/api/session';
        return $resource(url);
    });