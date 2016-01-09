'use strict';

angular.module('myApp.authz', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notAuthorised', {
    templateUrl: 'views/notAuthorised.html',
    controller: 'NauthCtrl'
  });
}])

.controller('NauthCtrl', ['$scope', function($scope) {
        
}]);


