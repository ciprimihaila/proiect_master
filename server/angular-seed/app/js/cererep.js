'use strict';

angular.module('myApp.cerere', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cerere', {
    templateUrl: 'views/cererepolita.html',
    controller: 'CerereCtrl',
    access: {
        // loginRequired: true,
        // requiredPermissions: ['Admin'],
        // permissionType: 'AtLeastOne'
    }
  });
}])

.controller('CerereCtrl', ['$scope', function($scope) {
      console.log("CerereCtrl");
    $scope.vm = this;
    $scope.vm.auto = {
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
        ],
        tipauto: {id: '1', name: 'Option A'},
        tipAutoAvailableOptions: [
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