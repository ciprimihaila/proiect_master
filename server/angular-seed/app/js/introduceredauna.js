'use strict';

angular.module('myApp.dauna', ['ngRoute', 'ngFileUpload'])

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

.controller('IntroDaunaCtrl', ['$scope', '$http', '$location', '$cookies', 'Upload', '$timeout', 'transferService',
                          function($scope, $http, $location, $cookies, Upload, $timeout, transferService ) {

    var precompletatDauna = transferService.getDauna()
    $scope.vm = this;
    $scope.vm.marcaAvailableOptions = carBrands; /*global carBrands*/
    $scope.vm.dauna = {
        marca: {id: '0', name: '-- select brand --'}
    };
    $scope.vm.show = false;
    function dauna(file) {
       file.upload = Upload.upload({
            url: '/upload',
            data: {"file": file},
      });
  
      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      $scope.vm.dauna['username'] = $cookies.get('username');
      $scope.vm.dauna['filename'] = file.name;
      console.log($scope.vm.dauna)
      var data = JSON.stringify($scope.vm.dauna);
      
      var post = $http.post("/dauna", data);
            
          post.success(function(data, status) {
            if (data.status == 'error'){
              $scope.vm.message = data.message;
              $location.path('/introduceredauna');
              $scope.vm.show = true;
              $scope.vm.msgclass = "alert alert-danger";
            } else if (data.status == 'ok'){
                $scope.vm.message = 'Dauna inregistrata cu succes';
                $scope.vm.readonly = true;
                $scope.vm.show = true;
                $scope.vm.msgclass = "alert alert-success";
            }
          });
        
            
      };

    if (precompletatDauna != null){
      $scope.vm.readonly = true;
      $scope.vm.dauna = precompletatDauna;
      $scope.vm.dauna.filename = "/uploads/"+$scope.vm.dauna.filename;
    } else {
      $scope.vm.dauna = {};
    }

    $scope.vm.send = dauna;
    
    $scope.vm.date = new Date();
        
}]);