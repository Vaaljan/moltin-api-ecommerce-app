angular.module('mainApp').directive('viewCartBanner', function () {
    return {
        restrict: 'EA', //Allow as Element [<address></address>] or as attribute [<div address></div>]
        templateUrl: 'views/partial/viewCartBanner.html',
        scope:true
    };
});