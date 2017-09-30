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