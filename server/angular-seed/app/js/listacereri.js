'use strict';

angular.module('myApp.listacereri', ['ngRoute', 'smart-table'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/listacereripolite', {
    templateUrl: 'views/listacereripolite.html',
    controller: 'ListaCereriCtrl',
    access: {
        // loginRequired: true,
        // requiredPermissions: ['Admin'],
        // permissionType: 'AtLeastOne'
    }
  });
}])

.controller('ListaCereriCtrl', ['$scope', '$http', '$location', 'transferService', '$route', function($scope, $http, $location, transferService, $route) {
    
    $scope.vm = this;
    $scope.vm.show = false;
    var gett = $http({
        url: "/cereri",
        method: "GET",
    });
    var collection = [];      
    gett.success(function(data, status) {
        if (data.status == 'error'){
            $scope.vm.message = data.message;
            $location.path('/listacereripolite');
            $scope.vm.show = true;
        } else if (data.status == 'ok'){
            for (var entry in data.message) {
                console.log(data.message[entry]);
                collection.push(data.message[entry]);
            }
        }
    });
   
    $scope.send = function send(row) {
        var data = JSON.stringify({id: row._id});
            
        var post = $http.post("/emitereCerere", data);
            
        post.success(function(data, status) {
            if (data.status == 'error'){
                $scope.vm.message = data.message;
                $scope.vm.show = true;
                $location.path('/listacereripolite');
            } else if (data.status == 'ok'){
                $scope.vm.message = data.message;
                $scope.vm.show = true;
                $route.reload();
            }
        });
        
    }
    
    $scope.view = function view(row) {
        transferService.sendCerere(row);
        $location.path("/cerere");
    }
    
    $scope.rowCollection = collection;
    $scope.displayedCollection = collection
}]);