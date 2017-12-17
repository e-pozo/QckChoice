'use strict';

angular.module('navBar')
    .component('navBar', {
        templateUrl: 'templates/nav-bar.html',
        controller: function ($scope, $q, Auth, $location, $translate, PersonCore) {
            $scope.logged = Auth.isLoggedIn();
            if($scope.logged){
                PersonCore.aboutMe()
                    .then(function (me) {
                        sessionStorage.setItem('me',JSON.stringify(me))
                    })
            }
            $scope.logOut = function () {
                //call logOut from service
                Auth.logout()
                    .then(function () {
                        $scope.logged = Auth.isLoggedIn();
                        $location.path('/welcome');
                    })
            };
            $scope.getClass = function () {
                  if($location.path() === '/welcome'){
                      return 'navbar navbar-inverse navbar-fixed-top';
                  }
                  else{
                      return 'navbar navbar-inverse';
                  }
            };
            $scope.changeLang = function(lang){
                $translate.use(lang);
            };
        }
    });