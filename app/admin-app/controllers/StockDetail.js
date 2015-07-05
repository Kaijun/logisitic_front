(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'StockService'];

    /* @ngInject */
    function StockDetailCtrl($scope, $state, $stateParams, $timeout, StockService) {

        $scope.stock = null;
        $scope.stockId = $stateParams.stockId;
        $scope.enterStock = enterStock;

        activate();

        ////////////////

        function activate() {
            if($scope.stockId){
                StockService.getStock($scope.stockId).then(function (data) {
                    $timeout(function() {
                        $scope.stock = data;
                    });
                }, function() {
                    $state.go('stockList');
                });
            }
            else{
                $state.go('stockList');
            }
        }

        function enterStock () {
            if($scope.stockId){
                StockService.enterStock($scope.stockId).then(function(data) {
                    debugger;
                    $state.go('stockDetail', {stockId: data.stockId});
                    debugger;
                });
            }
        }
    }
})();