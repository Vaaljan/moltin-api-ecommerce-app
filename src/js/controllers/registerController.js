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