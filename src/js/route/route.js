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