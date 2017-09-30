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
