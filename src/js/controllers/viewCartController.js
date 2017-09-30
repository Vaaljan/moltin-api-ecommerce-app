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
