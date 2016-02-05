'use strict';

angular.module('myApp.usermanagement', ['ngRoute', 'smart-table'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/usermanagement', {
    templateUrl: 'views/usermanagement.html',
    controller: 'UserManagementCtrl',
    access: {
        loginRequired: true,
        requiredPermissions: ['Admin'],
        permissionType: 'AtLeastOne'
    }
  });
}])

.controller('UserManagementCtrl', ['$route', '$scope', '$http', '$location', 'transferService', '$uibModal', function($route, $scope, $http, $location, transferService, $uibModal) {
    
    $scope.items = ['User', 'Broker', 'Admin'];

    var collection = [];
    
    var gett = $http({
        url: "/useri",
        method: "GET",
    });
    
    gett.success(function(data, status) {
        if (data.status == 'error'){
            $scope.vm.message = data.message;
            $location.path('/usermanagement');
            $scope.vm.show = true;
        } else if (data.status == 'ok'){
            for (var entry in data.message) {
                collection.push(data.message[entry]);
            }
            $scope.rowCollection = collection;
            $scope.diplayedCollection = collection;
        }
    });
    
    
    $scope.changeRole = function changeRole(row) {
         var dialog = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/roleSelect.html',
            controller: 'selectRoleCtrl',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        
        dialog.result.then(function (selectedItem) {
            var data = JSON.stringify({username: row.username, role: selectedItem});
                
            var post = $http.post("/editRole", data);
    
            post.success(function(data, status) {
                if (data.status == 'error'){
                    $scope.vm.message = data.message;
                    $location.path('/usermanagement');
                    $scope.vm.show = true;
                } else if (data.status == 'ok') {
                   $route.reload();
                }
                    
            });            
        },
        function () {
        });
    };
    
    $scope.deleteUser = function deleteUser(row) {

        var data = JSON.stringify({username: row.username});
            
        var post = $http.post("/deleteUser", data);

        post.success(function(data, status) {
            if (data.status == 'error'){
                $scope.vm.message = data.message;
                $location.path('/usermanagement');
                $scope.vm.show = true;
            } else if (data.status == 'ok') {
                $route.reload();
            }
                
        });
    };

}])
.controller('selectRoleCtrl', function ($scope, $uibModalInstance, items, $http) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
});