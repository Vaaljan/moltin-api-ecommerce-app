angular.module('mainApp').directive('cart', function () {
    return {
        restrict: 'EA', //Allow as Element [<address></address>] or as attribute [<div address></div>]
        templateUrl: 'views/partial/cart.html'
    };
});