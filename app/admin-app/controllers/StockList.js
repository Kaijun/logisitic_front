(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockListCtrl', StockListCtrl);

    StockListCtrl.$inject = ['$scope', '$state', '$http', '$timeout', 'StockService'];

    /* @ngInject */
    function StockListCtrl($scope, $state, $http, $timeout, StockService) {
        $scope.stocks = [];
        $scope.goToDetail = goToDetail;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            StockService.getStocks().then(function(data){
                $scope.stocks = data.data;
                $timeout(function () {
                    $scope.pageInfo = data;
                })
            })
        }
        function goToDetail (stock) {
            $state.go('stockDetail', {stockId: stock.package_id});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                $scope.stocks = response.data.data;
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }
    }
})();