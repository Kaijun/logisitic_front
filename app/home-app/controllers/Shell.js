(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['StockService'];

    /* @ngInject */
    function Shell(StockService) {
        var vm = this;
        vm.title = 'Controller';
        console.log('Shell initialized');
        activate();
        StockService.getStocks();

        ////////////////

        function activate() {
        }
    }
})();