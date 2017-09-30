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