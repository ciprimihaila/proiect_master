'use strict';

angular.module('myApp.dauna', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/introduceredauna', {
    templateUrl: 'views/introduceredauna.html',
    controller: 'IntroDaunaCtrl',
    access: {
        // loginRequired: true,
        // requiredPermissions: ['Admin'],
        // permissionType: 'AtLeastOne'
    }
  });
}])

.controller('IntroDaunaCtrl', ['$scope', function($scope) {
      console.log("IntroDaunaCtrl");
    $scope.vm = this;
    $scope.vm.dauna = {
        marca: {id: '1', name: 'Option A'},
        marcaAvailableOptions: [
          {id: '1', name: 'Option A'},
          {id: '2', name: 'Option B'},
          {id: '3', name: 'Option C'}
        ],
        model: {id: '1', name: 'Option A'},
        modelAvailableOptions: [
          {id: '1', name: 'Option A'},
          {id: '2', name: 'Option B'},
          {id: '3', name: 'Option C'}
        ]
   };
   
   function send() {
            $scope.vm.dataLoading = true;
            console.log("sdadsd");
            console.log($scope.vm.username);
            console.log($scope.vm.password);
    };
    $scope.vm.login = send;
    
    $scope.vm.date = new Date();
        
}]);