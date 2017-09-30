var sassConfig = {"colors":{"primaryColor":"#F5B430","secondaryColor":"#D12F1F","brandGrey":"#666666","brandGreen":"#3D9E93"},"defaultWidth":"123px"};

var app = angular.module('mainApp', ['ngRoute','ui.bootstrap','viewCache','storeFront.moltin','ngCookies']);

angular.module('mainApp').run(function ($rootScope, $location, $cookies, $http) {
  // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        // $rootScope.$on('$locationChangeStart', function (event, next, current) {
        //     // redirect to login page if not logged in and trying to access a restricted page
        //     var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        //     var loggedIn = $rootScope.globals.currentUser;
        //     if (restrictedPage && !loggedIn) {
        //         $location.path('/howto');
        //     }
        // });
	
});
angular.module('mainApp').config(function ($routeProvider) {

  $routeProvider
   .when('/shop', {
      templateUrl: 'views/shop.html',
      controller: 'shopController',
      controllerAs: 'shopCtrl',
      activeTab: 'shop',
          resolve:{
        products:function($q,MoltinAuth){
          var deferred = $q.defer();
          $q.when(MoltinAuth).then(function(moltin){
            moltin.Product.List(null,function(products){
                deferred.resolve(products);
            });
          })
          return deferred.promise;
        },
        categories:function($q,MoltinAuth){
          var deferred = $q.defer();
          $q.when(MoltinAuth).then(function(moltin){
            moltin.Category.List(null,function(categories){
                deferred.resolve(categories);
            });
          })
          return deferred.promise;
        }
      }
    })
   .when('/about', {
      templateUrl: 'views/about.html',
      activeTab: 'about'
    })
    .when('/complete', {
      templateUrl: 'views/complete.html',
      activeTab: 'complete'
    })
     .when('/products/:id', {
      templateUrl: 'views/productInfo.html',
      controller: 'productInfoController',
      controllerAs:'productInfoCtrl',
      resolve: {
          product: function($q, $route, MoltinAuth) {
            var deferred = $q.defer();
            MoltinAuth.then(function(moltin) {
              moltin.Product.Get($route.current.params.id, function(product) {
                deferred.resolve(product);
              });
            })
            return deferred.promise;
          },
          moltin: function(MoltinAuth) {
            return MoltinAuth;
          }
        }
    })
   .when('/howto', {
      templateUrl: 'views/howto.html',
      activeTab: 'howto'
    })
    .when('/contact', {
      templateUrl: 'views/contact.html',
      activeTab: 'contact'
    })
     .when('/productInfo', {
      templateUrl: 'views/productInfo.html',
       controller: 'productController',
      controllerAs: 'productCtrl',
      activeTab: 'productInfo'
    })
     .when('/viewCart', {
      templateUrl: 'views/viewCart.html',
       controller: 'viewCartController',
      controllerAs: 'viewCartCtrl',
      activeTab: 'viewCart',
      resolve: {
          cart: function($q, MoltinAuth) {
            var deferred = $q.defer();
            MoltinAuth.then(function(moltin) {
              moltin.Cart.Contents(function(cart) {
                deferred.resolve(cart);
              });
            })
            return deferred.promise;
          },
          moltin: function(MoltinAuth) {
            return MoltinAuth;
          }
        }
    })
     .when('/checkout', {
      templateUrl: 'views/checkout.html',
       controller: 'checkoutController',
      controllerAs: 'viewCartCtrl',
      activeTab: 'checkout',
       resolve: {
          cart: function($q, MoltinAuth) {
            var deferred = $q.defer();
            MoltinAuth.then(function(moltin) {
              moltin.Cart.Contents(function(cart) {
                deferred.resolve(cart);
              });
            })
            return deferred.promise;
          },
          options: function($q, MoltinAuth) {
            var deferred = $q.defer();
            MoltinAuth.then(function(moltin) {
              moltin.Cart.Checkout(function(options) {
                deferred.resolve(options);
              });
            })
            return deferred.promise;
          },
          fields: function($q, MoltinAuth) {
            var deferred = $q.defer();
            MoltinAuth.then(function(moltin) {
              moltin.Address.Fields(null, null, function(fields) {
                deferred.resolve(fields);
              });
            })
            return deferred.promise;
          },
          moltin: function(MoltinAuth) {
            return MoltinAuth;
          }
        }
    })
      .when('/payment', {
        templateUrl: 'views/payment.html',
        controller: 'paymentController',
        controllerAs: 'paymentCtrl',
        resolve: {
          moltin: function($q, MoltinAuth) {
            return MoltinAuth;
          }
        }
      })
        .when('/login', {
      templateUrl: 'views/login.html',
       controller: 'loginController',
      controllerAs: 'logintrl',
      activeTab: 'login'
    })
          .when('/register', {
      templateUrl: 'views/register.html',
       controller: 'registerController',
      controllerAs: 'registerCtrl',
      activeTab: 'register'
    })
    .otherwise({
      redirectTo: '/howto',
      activeTab: 'howto'
    });
});
angular.module('mainApp').factory('AuthenticationService', function($http, $cookies, $rootScope, $timeout, UserService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            $timeout(function () {
                var response;
                UserService.GetByUsername(username)
                    .then(function (user) {
                        if (user !== null && user.password === password) {
                            response = { success: true };
                        } else {
                            response = { success: false, message: 'Username or password is incorrect' };
                        }
                        callback(response);
                    });
            }, 1000);

            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });

        }

        function SetCredentials(username, password) {
            var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }


    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

});

angular.module('mainApp').service('dataService', function() {
  /* jshint ignore:start */
  // Ignore the variable not declared warining -- the processData is injected by the system
  this.productData = productData;
  // this.sassConfig = sassConfig || {};
  /* jshint ignore:end */
var self = this;

////Global Functions
self.singleProduct = null;
self.currentCart =  [];
self.cart;

self.getProductData = function(prodNo){
	self.singleProduct = prodNo;
}

self.images = [];
	
		self.currentIndex = 0;
		
		self.setCurrentIndex = function(index){
			self.currentIndex = index;
		};

		self.isCurrentIndex = function(index){
			return self.currentIndex === index;
		};

		self.showNext = function(){
			self.currentIndex = (self.currentIndex < self.images.length - 1) ? ++self.currentIndex : 0;
		};
		self.showPrevious = function(){
			self.currentIndex = (self.currentIndex > 0) ? --self.currentIndex : self.images.length -1;
		};



});

angular.module('mainApp').factory('FlashService', function($rootScope) {

 var service = {};

        service.Success = Success;
        service.Error = Error;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
    


});
angular.module('storeFront.moltin',[])
		.factory('MoltinAuth', function($q){
			var deferred = $q.defer();
			var moltin = new Moltin({publicId:'qKRonmK7IZATt9cgEUAcoC5G6QUC4JZuskieyAWkLJ'})
				moltin.Authenticate(function(){
							deferred.resolve(moltin)
					});

return deferred.promise;
});
angular.module('mainApp').factory('UserService', function($timeout, $filter, $q) {
       var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    

});
angular.module('mainApp').factory('UserService', function($timeout, $filter, $q) {
       
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { id: id });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByUsername(user.username)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                        } else {
                            var users = getUsers();

                            // assign id
                            var lastUser = users[users.length - 1] || { id: 0 };
                            user.id = lastUser.id + 1;

                            // save to local storage
                            users.push(user);
                            setUsers(users);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getUsers() {
            if(!localStorage.users){
                localStorage.users = JSON.stringify([]);
            }

            return JSON.parse(localStorage.users);
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }
    
});
angular.module('mainApp')

  .controller('checkoutController', function ($scope, $rootScope, $location, moltin, cart, options, fields) {

      $scope.customerInfo = {};

      $scope.update = function(user) {
        $scope.customerInfo = angular.copy(user);            

      };

      $scope.reset = function() {
        $scope.user = angular.copy($scope.customerInfo);
      };

      $scope.reset();


    $scope.data = {bill: {}, notes: '', shipping: '', gateway: ''}
    $scope.cart = cart;
    $scope.options = options;
    $scope.fields = fields;
    // console.log("fields ",$scope.fields)
    console.log("options ",$scope.options)
    // console.log("cart ",$scope.cart)
    $scope.createOrder = function() {
      moltin.Cart.Complete({
        customer: "",
        shipping: $scope.data.shipping,
        gateway: $scope.data.gateway,
        bill_to: $scope.customerInfo.address,
      }, function(response) {
        $rootScope.order = response;
        $rootScope.$apply(function() {
          $location.path('#/payment');
        });
      })
    }
    





  });
angular.module('mainApp')

  .controller('loginController', function ($scope, $location, AuthenticationService, FlashService) {
  		 var controller = this;


        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
console.log(AuthenticationService)
        controller.login =function() {
            controller.dataLoading = true;
            AuthenticationService.Login(controller.username, controller.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(controller.username, controller.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    controller.dataLoading = false;
                }
            });
        };

  });
angular.module('mainApp')

  .controller('mainController', ['dataService','$location','UserService', '$rootScope', function (dataService, $location,UserService, $rootScope) {
    
    var controller = this;
    
    controller.productData = dataService.productData;
    
    controller.setTab = function (tabName) {
      controller.selectedTab = tabName;
    };
    controller.isTabSelected = function (path) {
      return $location.path().substr(0, path.length) === path;
    };

        controller.user = null;
        controller.allUsers = [];
        controller.deleteUser = deleteUser;

      
        // console.log($rootScope)
        // initController();
        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    controller.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    controller.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }

  }]);
angular.module('mainApp')
  .controller('paymentController', function ($scope, $location, $rootScope, moltin,dataService) {

    $scope.payment = function(data) {
      console.log($scope)
      
      moltin.Checkout.Payment('purchase', $scope.order.id, {data: $scope.data}, function(response) {
        $rootScope.order = $rootScope.cart = null;
        $rootScope.payment = response;
        $rootScope.$apply(function() {
          $location.path('/complete');
        });
      });
    }

});

angular.module('mainApp')

  .controller('productInfoController', function ($scope,dataService,product,moltin,$rootScope,$timeout) {
    
    var controller = this;

    controller.dataService = dataService;

   $scope.product = product;
    $scope.addStatus = null;
    // console.log($scope.product)
    $scope.addCart = function() {

      $scope.addStatus = 'Adding to cart...';
      // Insert(id, qty, modifiers/size, callback)
      moltin.Cart.Insert(product.id, 1, null, function(cart) {
        $scope.addStatus = 'Success!';
        moltin.Cart.Contents(function(items) {
          $rootScope.cart = items;
          $rootScope.$apply();
        });
        $scope.$apply();
        $timeout(function() {
          $scope.addStatus = null;
        }, 1000);
      });
      $("#cartNav").show();
      $(".viewCartBanner").show();
    }


  });
angular.module('mainApp')

  .controller('registerController', function ($scope, $rootScope, $location, moltin, cart, options, fields,UserService, $location, $rootScope, FlashService) {
  		   var controller = this;

        

        controller.register = function () {
            controller.dataLoading = true;
            UserService.Create(controller.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        controller.dataLoading = false;
                    }
                });
        }

  });
angular.module('mainApp')

  .controller('shopController', ['dataService','products','categories', function (dataService,products,categories) {
    
    var controller = this;
    controller.products = products;
    controller.dataService = dataService;
    controller.products = products;
     controller.categories = categories;

// console.log("categories ",categories)
controller.category = _.chain(controller.products)
	.map(function(item){
		return {
		"category":item.category.value,
		"data":item
	}
	})
	.groupBy("category")
.value();



  }]);
angular.module('mainApp')

  .controller('viewCartController', function (dataService,$scope, cart,moltin) {

    var controller = this;
    controller.dataService = dataService;
  	$scope.cart = cart;


$scope.removeItem = function(id){
				moltin.Cart.Remove(id, function() {
				 	  // $scope.$apply();
				 	  window.location.reload();
				}, function(error) {
					
				   console.log("Failed")
				});

}

  });

angular.module('mainApp').directive('cart', function () {
    return {
        restrict: 'EA', //Allow as Element [<address></address>] or as attribute [<div address></div>]
        templateUrl: 'views/partial/cart.html'
    };
});
angular.module('mainApp').directive('viewCartBanner', function () {
    return {
        restrict: 'EA', //Allow as Element [<address></address>] or as attribute [<div address></div>]
        templateUrl: 'views/partial/viewCartBanner.html',
        scope:true
    };
});