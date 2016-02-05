'use strict';

angular.module('myApp.service', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/service', {
    templateUrl: 'views/introducere_service.html',
    controller: 'ServiceCtrl',
    access: {
        loginRequired: true,
        requiredPermissions: ['Admin'],
        permissionType: 'AtLeastOne'
    }
  });
}])


.controller('ServiceCtrl', ['$scope','$http','$location','$route', function($scope,$http,$location,$route) {
      $scope.vm = this;
      function send() {
        var data = JSON.stringify($scope.vm.service);
            
        var post = $http.post("/serviceAuto", data);
            
        post.success(function(data, status) {
            if (data.status == 'error'){
                $scope.vm.class = "alert alert-danger"
                $scope.vm.message = data.message;
                $location.path('/service');
                $scope.vm.show = true;
            } else if (data.status == 'ok'){
                $scope.vm.class = "alert alert-success"
                $scope.vm.message = data.message;
                $scope.vm.show = true;
                setTimeout(function(){ $route.reload(); }, 2000);
            }
            
        });
      };
      $scope.vm.send = send;
 
 
        
}]);