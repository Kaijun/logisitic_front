(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('AddressEditCtrl', AddressEditCtrl);

    AddressEditCtrl.$inject = [];

    /* @ngInject */
    function AddressEditCtrl() {
        var vm = this;
        vm.title = 'AddressEditCtrl';

        activate();

        ////////////////

        function activate() {
        }
    }
})();