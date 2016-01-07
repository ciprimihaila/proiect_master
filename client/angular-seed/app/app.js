'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.register',
  'myApp.cerere',
  'myApp.listacereri',
  'myApp.usermanagement',
  'myApp.authz',
  'myApp.dauna',
  'myApp.listadaune',
  'myApp.service',
  'myApp.version'
]);
     

app.controller('NavCtrl', ['$scope','$location', function($scope,$location) {
    console.log("NavCtrl");
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
    $scope.isVisible = function (role) { 
        if (role =='LogOut') return true;
        var roles = role.split(",");
        for (var i = 0; i < roles.length; i++) {
            if (roles[i] === loggedUser.permissions[0]) return true;
        }
        return false;
    };
 
}]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
//   $routeProvider.when('#/main', {templateUrl : 'main.html'});
}]);


var loggedUser = {
                    name: 'test',
                    permissions: ['NotAuth']
                };


var authorisedConstants = {
                authorised: 0,
                loginRequired: 1,
                notAuthorised: 2
            };

var permissionCheckTypeConstants = {
                atLeastOne: "AtLeastOne",
                combinationRequired: "combinationRequired"
            };
            

// function demoUser(){
//   return {
//     name: 'test',
//     permissions: 'Admin'
//   };
// }


app.factory('authorization', [  
      function () {  
        var authorize = function (loginRequired, requiredPermissions, permissionCheckType) {
          var result = authorisedConstants.authorised;
          var user = loggedUser; 
          var loweredPermissions = [];
          var hasPermission = true;
          var permission, i;
      
          permissionCheckType = permissionCheckType || permissionCheckTypeConstants.atLeastOne;
          if (loginRequired === true && user === undefined) {
              result = authorisedConstants.loginRequired;
          } else if ((loginRequired === true && user !== undefined) &&
              (requiredPermissions === undefined || requiredPermissions.length === 0)) {
              // Login is required but no specific permissions are specified.
              result = authorisedConstants.authorised;
          } else if (requiredPermissions) {
              loweredPermissions = [];
              angular.forEach(user.permissions, function (permission) {
                  loweredPermissions.push(permission.toLowerCase());
              });
      
              for (i = 0; i < requiredPermissions.length; i += 1) {
                  permission = requiredPermissions[i].toLowerCase();
      
                  if (permissionCheckType === permissionCheckTypeConstants.combinationRequired) {
                      hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
                      // if all the permissions are required and hasPermission is false there is no point carrying on
                      if (hasPermission === false) {
                          break;
                      }
                  } else if (permissionCheckType === permissionCheckTypeConstants.atLeastOne) {
                      hasPermission = loweredPermissions.indexOf(permission) > -1;
                      // if we only need one of the permissions and we have it there is no point carrying on
                      if (hasPermission) {
                          break;
                      }
                  }
              }
      
              result = hasPermission ?
                       authorisedConstants.authorised :
                       authorisedConstants.notAuthorised;
          }
      
          return result;
        };
      
      return {
        authorize: authorize
      };
}]);

app.run([  
    '$rootScope',
    '$location',
    'authorization',
    function ($rootScope, $location, authorization) {
        var routeChangeRequiredAfterLogin = false,
            loginRedirectUrl;
        $rootScope.$on('$routeChangeStart', function (event, next) {
            var authorised;
            if (routeChangeRequiredAfterLogin && next.originalPath !== '/login') {
                routeChangeRequiredAfterLogin = false;
                $location.path('/login').replace();
            } else if (next.access !== undefined) {
                authorised = authorization.authorize(next.access.loginRequired,
                                                     next.access.requiredPermissions,
                                                     next.access.permissionType);
                if (authorised === authorisedConstants.loginRequired) {
                    routeChangeRequiredAfterLogin = true;
                    loginRedirectUrl = next.originalPath;
                    $location.path('/login');
                } else if (authorised === authorisedConstants.notAuthorised) {
                    $location.path('/notAuthorised').replace();
                }
            }
        });
}]);

app.directive('access', [  
    'authorization',
    function (authorization) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var makeVisible = function () {
                element.removeClass('hidden');
            },
            makeHidden = function () {
                element.addClass('hidden');
            },
            determineVisibility = function (resetFirst) {
                var result;
                if (resetFirst) {
                    makeVisible();
                }

            result = authorization.authorize(true, roles, attrs.accessPermissionType);
                if (result === authorisedConstants.authorised) {
                    makeVisible();
                } else {
                    makeHidden();
                }
            },
            roles = attrs.access.split(',');

            if (roles.length > 0) {
                determineVisibility(true);
            }
      }
  };
}]);
