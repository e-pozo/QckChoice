angular.module('eventCore').factory('EventCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            function updateEvent() {
                var deferred = $q.defer();
                $http.put('/api/sessionUser/:id/event/:idEvent')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 201){
                            deferred.resolve(result.data)
                        }
                        else{
                            deferred.reject(result.data)
                        }
                    })
                    .catch(function (err){
                        console.log(err);
                        deferred.reject(err)
                    });
                return deferred.promise;
            }

            function deleteEvent() {
                var deferred = $q.defer();
                $http.delete('/api/sessionUser/:id/event/:idEvent')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve("Event deleted successfully.")
                        }
                        else{
                            deferred.reject(result.data)
                        }
                    })
                    .catch(function (err){
                        console.log(err);
                        deferred.reject(err)
                    });
                return deferred.promise;
            }

            function listEvent() {
                var deferred = $q.defer();
                $http.get('/api/sessionUser/:id')
                    .then(function (result) {
                        console.log(result);
                        if(result.status == 200){
                            deferred.resolve(result.data);
                        }
                        else{
                            deferred.reject(result);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        deferred.reject(err)
                    });
                return deferred.promise;
            }

            function makeEvent(objective) {
                var deferred = $q.defer();
                $http.post('/api/sessionUser/:id', {objective: objective})
                // handle success
                    .then(function (data) {
                        if(data.status === 201){
                            deferred.resolve("Event created successfully!");
                        }
                        else {
                            deferred.reject(data);
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }

            return ({
                makeEvent: makeEvent,
                listEvent: listEvent,
                deleteEvent: deleteEvent,
                updateEvent: updateEvent
            });

        }]);