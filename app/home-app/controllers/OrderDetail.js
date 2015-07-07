(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderDetailCtrl', OrderDetailCtrl);

    OrderDetailCtrl.$inject = [];

    /* @ngInject */
    function OrderDetailCtrl() {
        var vm = this;
        vm.title = 'OrderDetailCtrl';

        activate();

        ////////////////

        function activate() {
        }
    }
})();