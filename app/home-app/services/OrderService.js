(function() {
    'use strict';

    angular
        .module('home.services')
        .service('OrderService', OrderService);

    OrderService.$inject = [];

    /* @ngInject */
    function OrderService() {
        this.func = func;

        ////////////////

        function func() {
        }
    }
})();