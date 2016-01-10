'use strict';

angular.module('myApp.service', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/service', {
    templateUrl: 'views/introducere_service.html',
    controller: 'ServiceCtrl',
  });
}])


.controller('ServiceCtrl', ['$scope','$http','$location', function($scope,$http,$location) {
      $scope.vm = this;
      function send() {
        var data = JSON.stringify($scope.vm.service);
            
        var post = $http.post("/serviceAuto", data);
            
        post.success(function(data, status) {
            if (data.status == 'error'){
                $scope.vm.message = data.message;
                $location.path('/service');
                $scope.vm.show = true;
            } else if (data.status == 'ok'){
                $location.path(data.url);
            }
            
        });
      };
      $scope.vm.send = send;
 
 
        
}]);