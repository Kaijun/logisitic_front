(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintStockBatch', PrintStockBatch);

    PrintStockBatch.$inject = ['$scope'];

    /* @ngInject */
    function PrintStockBatch($scope) {
        var vm = this;
        vm.title = 'PrintStockBatch';

        activate();

        ////////////////

        function activate() {
        }
    }
})();