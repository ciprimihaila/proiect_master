'use strict';
/** @module Login  */
angular.module('myApp.login', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  });
}])

/** @class ContrllerLogin  */
.controller('LoginCtrl', ['$scope', '$location', '$http', '$cookies', function($scope, $location, $http, $cookies) {
      
      $scope.vm = this;
      $scope.vm.show = false;
      function login() {
            
            var gett = $http({
                url: "/user",
                method: "GET",
                params:{
                    username: $scope.vm.username,
                    password: $scope.vm.password
                }
            });
            
            gett.success(function(data, status) {
                if (data.status == 'error'){
                    $scope.vm.message = data.message;
                    $location.path('/login');
                    $scope.vm.show = true;
                } else if (data.status == 'ok'){
                    loggedUser = {
                        name:  $scope.vm.username,
                        permissions: [data.message.role]
                    };
                    $cookies.put("username", $scope.vm.username);
                    $location.path(data.url);
                }
            });
      }
      $scope.vm.login = login;
        
}]);