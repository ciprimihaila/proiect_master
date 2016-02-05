'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'views/register.html',
    controller: 'RegisterCtrl',
  });
}])


.controller('RegisterCtrl', ['$scope', '$http', '$location', function($scope, $http, $location ) {
      $scope.vm = this;
      $scope.vm.show = false;
      function register() {

            var data = JSON.stringify($scope.vm.user);
            
            var post = $http.post("/user", data);
            
            post.success(function(data, status) {
                if (data.status == 'error'){
                    $scope.vm.message = data.message;
                    $location.path('/register');
                    $scope.vm.show = true;
                } else if (data.status == 'ok'){
                    $location.path(data.url);
                }
                
            });
        
            
      };
      $scope.vm.register = register;
 
 
}]);