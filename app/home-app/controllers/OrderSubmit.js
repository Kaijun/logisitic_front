(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderSubmitCtrl', OrderSubmitCtrl);

    OrderSubmitCtrl.$inject = [];

    /* @ngInject */
    function OrderSubmitCtrl() {
        var vm = this;
        vm.title = 'OrderSubmitCtrl';

        activate();

        ////////////////

        function activate() {
        }
    }
})();