(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockQuickCtrl', StockQuickCtrl);


    /* @ngInject */
    function StockQuickCtrl($scope, StockService, $timeout) {

        $scope.stock = null;
        $scope.stockId = 1;

        activate();

        ////////////////

        function activate() {
            if($scope.stockId){
                StockService.getStock($scope.stockId).then(function (data) {
                    $timeout(function() {
                        $scope.stock = data;
                    });
                });
            }
        }
    }
})();