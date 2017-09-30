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