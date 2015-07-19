(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderQuick', OrderQuick);

    OrderQuick.$inject = ['$sc'];

    /* @ngInject */
    function OrderQuick($scope) {
        var vm = this;
        vm.title = 'OrderQuick';

        activate();

        ////////////////

        function activate() {
        }
    }
})();