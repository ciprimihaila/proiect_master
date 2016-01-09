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

.controller('CerereCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
      console.log("CerereCtrl");
    $scope.vm = this;
    $scope.vm.cerere = {};
    $scope.vm.cerere.date = new Date();
    $scope.vm.auto = {
      marcaAvailableOptions: carBrands,
      tipAutoAvailableOptions: tipAuto,
      durataAvailableOptions: [
          {id: '1', name: '3 luni'},
          {id: '2', name: '6 luni'},
          {id: '3', name: '1 an'}
        ]
    }
    
    $scope.vm.cerere = {
        marca: {id : '1 ' , name : "Alfa Rome"},
        tipauto:{id : '1 ' , name : "Autoturism"},
        durata:{id: '1', name: '3 luni'},

    };
   
   
    function send() {
      $scope.vm.cerere['username'] = loggedUser.name;
      var data = JSON.stringify($scope.vm.cerere);
            
      var post = $http.post("/cerere", data);
            
      post.success(function(data, status) {
        if (data.status == 'error'){
            $scope.vm.message = data.message;
            $location.path('/cerere');
            $scope.vm.show = true;
        } else if (data.status == 'ok'){
            $location.path(data.url);
        }
                
      });
    };
    $scope.vm.send = send;
    
    
        
}]);