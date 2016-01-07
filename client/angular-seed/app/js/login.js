'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
      console.log("asdadassdasdadas");
     // console.log(this.vm.username);
      // var vm = this;
      $scope.vm = this;
      function login() {
            $scope.vm.dataLoading = true;
            
            console.log($scope.vm.username);
            console.log($scope.vm.password);
            
           
           
             
           // location.reload();
        
            
            
            
            var path = "/login";
            
             if ($scope.vm.username == 'admin'){
                loggedUser = {
                    name: 'test',
                    permissions: ['Admin']
                };
                path = "/usermanagement";
            } else if ($scope.vm.username == 'broker'){
                loggedUser = {
                    name: 'test',
                    permissions: ['Broker']
                };
                path = "/listacereripolite";
            } else if ($scope.vm.username == 'user'){
                loggedUser = {
                    name: 'test',
                    permissions: ['User']
                };
                path = "/cerere";
            }
            
            $location.path(path);
      };
      $scope.vm.login = login;
 
     
        
}]);