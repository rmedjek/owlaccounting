(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;
        vm.accountType = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            },
            UserService.GetCurrent().then(function (accountType) {
                vm.accountType = accountType;
                if (vm.user.accountType !== "admin"){
                    document.getElementById("show").style.display = "none";
                }
            }

            ));
        }
    }

})();