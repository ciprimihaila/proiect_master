'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
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

var tipAuto =[
        {id : '1 ' , name : "Autoturism"    },
        {id : '2' , name : "Autocamion"    },
        {id : '3 ' , name : "Autoutilitara"    },
        {id : '4 ' , name : "Moto"    },
        {id : '5 ' , name : "Remorca"    },
        {id : '6 ' , name : "Tractor"    }
    ];

var carBrands = [{id : '1 ' , name : "Alfa Romeo",    },
{id : '2 ' , name : "Aston Martin",  },
{id : '3 ' , name : "Audi",         },
{id : '4 ' , name : "Bentley",      },
{id : '5 ' , name : "Benz",         },
{id : '6 ' , name : "BMW",          },
{id : '7 ' , name : "Bugatti",      },
{id : '8 ' , name : "Cadillac",      },
{id : '9 ' , name : "Chevrolet",    },
{id : '10' , name : "Chrysler",      },
{id : '11' , name : "Citroen",      },
{id : '12' , name : "Corvette",      },
{id : '13' , name : "DAF",          },
{id : '14' , name : "Dacia",        },
{id : '15' , name : "Daewoo",       },
{id : '16' , name : "Daihatsu",      },
{id : '17' , name : "Datsun",       },
{id : '18' , name : "De Lorean",    },
{id : '19' , name : "Dino",         },
{id : '20' , name : "Dodge",        },
{id : '21' , name : "Farboud",      },
{id : '22' , name : "Ferrari",      },
{id : '23' , name : "Fiat",         },
{id : '24' , name : "Ford",         },
{id : '25' , name : "Honda",        },
{id : '26' , name : "Hummer",       },
{id : '27' , name : "Hyundai",      },
{id : '28' , name : "Jaguar",       },
{id : '29' , name : "Jeep",         },
{id : '30' , name : "KIA ",         },
{id : '31' , name : "Koenigseg",    },
{id : '32' , name : "Lada",         },
{id : '33' , name : "Lamborghini",  },
{id : '34' , name : "Lancia",       },
{id : '35' , name : "Land Rover",    },
{id : '36' , name : "Lexus",        },
{id : '37' , name : "Ligier",       },
{id : '38' , name : "Lincoln",      },
{id : '39' , name : "Lotus",        },
{id : '40' , name : "Martini",      },
{id : '41' , name : "Maserati",      },
{id : '42' , name : "Maybach",      },
{id : '43' , name : "Mazda",        },
{id : '44' , name : "McLaren",      },
{id : '45' , name : "Mercedes",      },
{id : '46' , name : "Mercedes-Benz",},
{id : '47' , name : "Mini",         },
{id : '48' , name : "Mitsubishi",    },
{id : '49' , name : "Nissan",       },
{id : '50' , name : "Noble",        },
{id : '51' , name : "Opel",         },
{id : '52' , name : "Peugeot",      },
{id : '53' , name : "Pontiac",      },
{id : '54' , name : "Porsche",      },
{id : '55' , name : "Renault",      },
{id : '56' , name : "Rolls-Royce",  },
{id : '57' , name : "Rover",        },
{id : '58' , name : "Saab",         },
{id : '59' , name : "Seat",         },
{id : '60' , name : "Skoda",        },
{id : '61' , name : "Smart",        },
{id : '62' , name : "Spyker",       },
{id : '63' , name : "Subaru",       },
{id : '64' , name : "Suzuki",       },
{id : '65' , name : "Toyota",       },
{id : '66' , name : "Vauxhal",      },
{id : '67' , name : "Volkswagen",    },
{id : '68' , name : "Volvo"         }];


app.service('transferService', function() {
  var cerere = null;
  var dauna = null;
  
  var sendCerere = function(newObj) {
      cerere = newObj;
  };
  
  var getCerere = function() {
      var result = cerere;
      cerere = null;
      return result;
  };
  
  var sendDauna = function (newObj) {
      dauna = newObj;
  }
  
  var getDauna = function(){
      var rez = dauna;
      dauna = null;
      return rez;
  }

  return {
    sendCerere: sendCerere,
    getCerere: getCerere,
    sendDauna: sendDauna,
    getDauna : getDauna
  };

});

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
