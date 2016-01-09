'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
      
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
                        permissions: [data.role]
                    };
                    $location.path(data.url);
                }
                
            });
            
            
           // $scope.vm.dataLoading = true;
           
            
            // var path = "/login";
            
            //  if ($scope.vm.username == 'admin'){
            //     loggedUser = {
            //         name: 'test',
            //         permissions: ['Admin']
            //     };
            //     path = "/usermanagement";
            // } else if ($scope.vm.username == 'broker'){
            //     loggedUser = {
            //         name: 'test',
            //         permissions: ['Broker']
            //     };
            //     path = "/listacereripolite";
            // } else if ($scope.vm.username == 'user'){
            //     loggedUser = {
            //         name: 'test',
            //         permissions: ['User']
            //     };
            //     path = "/cerere";
            // }
            
            // $location.path(path);
      };
      $scope.vm.login = login;
 
     
        
}]);