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