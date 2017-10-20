'use strict';

angular.module('person')
    .factory('Person', function ($resource) {
        var url = '/api/test'
        return $resource(url)
    });