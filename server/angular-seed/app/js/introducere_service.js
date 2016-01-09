'use strict';

angular.module('myApp.service', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/service', {
    templateUrl: 'views/introducere_service.html',
    controller: 'ServiceCtrl',
  });
}])


.controller('ServiceCtrl', ['$scope', function($scope) {
      console.log("asdadassdasdadas");
     // console.log(this.vm.username);
      // var vm = this;
      $scope.vm = this;
      function register() {
            console.log("register");
            console.log($scope.vm.service.name);
            console.log($scope.vm.service.phone);
      };
      $scope.vm.register = register;
 
 
        
}]);