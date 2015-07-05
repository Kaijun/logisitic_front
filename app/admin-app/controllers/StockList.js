(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockListCtrl', StockListCtrl);

    StockListCtrl.$inject = ['$scope', '$state', 'StockService'];

    /* @ngInject */
    function StockListCtrl($scope, $state, StockService) {
        $scope.stocks = [];
        $scope.goToDetail = goToDetail;

        activate();

        ////////////////

        function activate() {
            StockService.getStocks().then(function(data){
                $scope.stocks = data;
            })
        }
        function goToDetail (stockId) {
            $state.go('stockDetail', {stockId: stockId});
        }
    }
})();