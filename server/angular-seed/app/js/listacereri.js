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

.controller('ListaCereriCtrl', ['$scope', function($scope) {
      console.log("asdadassdasdadas");
     // console.log(this.vm.username);
      // var vm = this;
     var collection = [
        {firstName: 'Laurent', lastName: 'Renard', address: 'strada judet....', auto: 'Dacia Logan', date: new Date('1987-05-21')},
        {firstName: 'Blandine', lastName: 'Faivre', address: 'strada judet....', auto: 'Opel Astra', date: new Date('1987-04-25')},
        {firstName: 'Francoise', lastName: 'Frere', address: 'strada judet....', auto: 'BMW Seria 5', date: new Date('1955-08-27')},
        {firstName: 'Laurent', lastName: 'Renard', address: 'strada judet....', auto: 'Dacia Logan', date: new Date('1987-05-21')},
        {firstName: 'Blandine', lastName: 'Faivre', address: 'strada judet....', auto: 'Opel Astra', date: new Date('1987-04-25')},
        {firstName: 'Francoise', lastName: 'Frere', address: 'strada judet....', auto: 'BMW Seria 5', date: new Date('1955-08-27')},
        {firstName: 'Laurent', lastName: 'Renard', address: 'strada judet....', auto: 'Dacia Logan', date: new Date('1987-05-21')},
        {firstName: 'Blandine', lastName: 'Faivre', address: 'strada judet....', auto: 'Opel Astra', date: new Date('1987-04-25')},
        {firstName: 'Francoise', lastName: 'Frere', address: 'strada judet....', auto: 'BMW Seria 5', date: new Date('1955-08-27')}
    ];
    
    
    $scope.send = function send(row) {
        console.log('send' + row.firstName);
    }
    
    $scope.view = function view(row) {
        console.log('view' + row.firstName);
    }
    
    $scope.rowCollection = collection;
    $scope.displayedCollection = collection
}]);