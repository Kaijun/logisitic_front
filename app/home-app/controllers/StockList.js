/*  TODO: 之后可以抽象成一个Directive 用作所有的ListView!!! */

'use strict';
;(function () {
	
    angular.module('home.controllers')
    .controller('StockListCtrl', ['$scope', '$state', 'StockService', function($scope, $state, StockService) {

        $scope.stockList = [];
        $scope.goToDetail = goToDetail;

        active();

        function active () {
            StockService.getStocks().then(function (list) {
                $scope.stockList = list;
                console.log(list)
            });
        }
    	
        function goToDetail (stockId) {
            $state.go('stockDetail', {stockId: stockId});
        }

    }]);
})();