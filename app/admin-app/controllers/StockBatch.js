(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockBatchCtrl', StockBatchCtrl);

    StockBatchCtrl.$inject = [];

    /* @ngInject */
    function StockBatchCtrl() {
        var vm = this;
        vm.title = 'StockBatchCtrl';

        activate();

        ////////////////

        function activate() {
        }
    }
})();