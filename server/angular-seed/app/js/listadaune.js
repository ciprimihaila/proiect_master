'use strict';

angular.module('myApp.listadaune', ['ngRoute', 'smart-table'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/listadaune', {
    templateUrl: 'views/listadaune.html',
    controller: 'ListaDauneCtrl',
    access: {
        // loginRequired: true,
        // requiredPermissions: ['Broker'],
        // permissionType: 'AtLeastOne'
    }
  });
}])

.controller('ListaDauneCtrl',  ['$scope', '$http', '$location', '$uibModal', 'transferService',
                                        function($scope, $http, $location, $uibModal, transferService) {
    // var vm = this;
     
    var gett = $http({
        url: "/daune",
        method: "GET",
    });
    var collection = [];      
    gett.success(function(data, status) {
        if (data.status == 'error'){
            $scope.vm.message = data.message;
            $location.path('/listadaune');
            $scope.vm.show = true;
        } else if (data.status == 'ok'){
            for (var entry in data.message) {
                console.log(data.message[entry]);
                collection.push(data.message[entry]);
            }
        }
    });
    
    
    $scope.send = function send(row) {
        var dialog = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'views/popupview.html',
          controller: 'ModalCtrl',
          resolve: {
            items: function () {
              return {};
            }
          }
        });
        
        dialog.result.then(function (selectedItem) {
          if (selectedItem.length > 0){
            var data = JSON.stringify(
                {   idService: selectedItem[0]._id,
                    idDauna: row.id
                });
            
        //   var post = $http.post("/emitereCerere", data);
                
        //   post.success(function(data, status) {
        //         if (data.status == 'error'){
        //             $scope.vm.message = data.message;
        //             $scope.vm.show = true;
        //             $location.path('/listacereripolite');
        //         } else if (data.status == 'ok'){
        //             $scope.vm.message = data.message;
        //             $scope.vm.show = true;
        //             location.reload();
        //         }
        //     });  
          }
           
          
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
    }
    
    $scope.view = function view(row) {
        transferService.sendDauna(row);
        $location.path("/introduceredauna");
    }
    
    $scope.rowCollection = collection;
    $scope.displayedCollection = collection
}])

.controller('ModalCtrl', function ($scope, $uibModalInstance, items, $http) {
    var gett = $http({
        url: "/serviceuriauto",
        method: "GET",
    });
    var collection = [];      
    gett.success(function(data, status) {
        if (data.status == 'error'){
            //todo
        } else if (data.status == 'ok'){
            for (var entry in data.message) {
                console.log(data.message[entry]);
                collection.push(data.message[entry]);
            }
        }
    });
    $scope.rowCollection = collection;
    $scope.displayedCollection = collection
    $scope.modal = [];
    $scope.modal.title = "Selectie Service";

      $scope.ok = function () {
        var selected = $scope.rowCollection.filter(function(item){
             return item.isSelected === true;
        })
        $uibModalInstance.close(selected);
      };
    
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});