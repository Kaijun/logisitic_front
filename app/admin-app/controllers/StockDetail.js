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
                    data.createTimeString = (new Date(data.created_time.date)).toISOString().substring(0, 10);
                    data.updateTimeString = (new Date(data.updated_time.date)).toISOString().substring(0, 10);
                    data.status = parseInt(data.status);
                    data.statusStr = StockService.getStockStatusMapping(data.status);
                    
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
                    $state.go($state.current, {stockId: data.package_id}, {reload: true});
                });
            }
        }
    }
})();