'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'views/register.html',
    controller: 'RegisterCtrl',
  });
}])


.controller('RegisterCtrl', ['$scope', function($scope) {
      console.log("asdadassdasdadas");
     // console.log(this.vm.username);
      // var vm = this;
      $scope.vm = this;
      function register() {
            console.log("register");
            console.log($scope.vm.user.username);
            console.log($scope.vm.user.password);
      };
      $scope.vm.register = register;
 
 
        
}]);