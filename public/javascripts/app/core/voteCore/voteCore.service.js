angular.module('voteCore').factory('VoteCore',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http, $location) {

            function getVotes() {
                var deferred = $q.defer();
                $http.get('/api/sessionUser/:id/event/:idEvent')
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

            function createVote() {
                var deferred = $q.defer();
                $http.post('/api/sessionUser/:id/event/:idEvent')
                // handle success
                    .then(function (data) {
                        if(data.status === 201){
                            deferred.resolve("Vote created successfully!");
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
                createVote: createVote,
                getVotes: getVotes
            });

        }]);