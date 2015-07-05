(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['StockService', '$scope', '$timeout', '$stateParams', '$state'];

    /* @ngInject */
    function StockDetailCtrl(StockService, $scope, $timeout, $stateParams, $state) {
        $scope.stock = null;
        $scope.deleteStock = deleteStock;
        $scope.editStock = editStock;

        activate();

        ////////////////

        function activate() {
            if($stateParams.stockId){
                var stockId = $stateParams.stockId;
                StockService.getStock(stockId).then(function(data){
                    $timeout(function () {
                        $scope.stock = data;
                    });
                },
                function(){
                    $state.go('index');
                })
            }
            else{
                $state.go('index');
            }
        }

        function editStock () {
            $state.go('stockEdit', {stockId: $stateParams.stockId});
        }
        function deleteStock () {
            
        }
    }
})();