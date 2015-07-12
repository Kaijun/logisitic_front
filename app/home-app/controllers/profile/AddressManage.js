(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('AddressManageCtrl', AddressManageCtrl);

    AddressManageCtrl.$inject = [];

    /* @ngInject */
    function AddressManageCtrl() {
        var vm = this;
        vm.title = 'AddressManageCtrl';

        activate();

        ////////////////

        function activate() {
        }
    }
})();