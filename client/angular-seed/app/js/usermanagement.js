'use strict';

angular.module('myApp.usermanagement', ['ngRoute', 'smart-table'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/usermanagement', {
    templateUrl: 'views/usermanagement.html',
    controller: 'UserManagementCtrl',
    access: {
        // loginRequired: true,
        // requiredPermissions: ['Admin'],
        // permissionType: 'AtLeastOne'
    }
  });
}])

.controller('UserManagementCtrl', ['$scope', function($scope) {
     // console.log("asdadassdasdadas");
      // var vm = this;
     var collection = [
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Broker'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Broker'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'User'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Service'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Broker'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Broker'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Broker'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Admin'},
        {name: 'Laurent Renard', username: 'lrenard', email: 'lrenard@asdad.com', phone: '1987-05-21', role: 'Broker'}
    ];
    
    
    $scope.send = function send(row) {
        console.log('send' + row.name);
    }
    
    $scope.view = function view(row) {
        console.log('view' + row.name);
    }
    
    $scope.rowCollection = collection;
    $scope.displayedCollection = collection
}]);