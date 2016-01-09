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

.controller('IntroDaunaCtrl', ['$scope', '$http', '$location', function($scope, $http, $location ) {

    console.log("IntroDaunaCtrl");
    $scope.vm = this;
    $scope.vm.marcaAvailableOptions = carBrands; /*global carBrands*/
    $scope.vm.dauna = {
        marca: {id: '0', name: '-- select brand --'}
    };
    $scope.vm.show = false;
    function dauna() {
      console.log("sending post");
      var data = JSON.stringify($scope.vm.dauna);
        
      var post = $http.post("/dauna", data);
            
          post.success(function(data, status) {
            if (data.status == 'error'){
              console.log(data.message);
              $scope.vm.message = data.message;
              $location.path('/dauna');
              $scope.vm.show = true;
            } else if (data.status == 'ok'){
              $location.path(data.url);
            }
          });
        
            
      };
   
    $scope.vm.send = dauna;
    
    $scope.vm.date = new Date();
        
}]);