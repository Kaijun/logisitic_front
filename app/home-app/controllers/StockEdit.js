(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('StockEditCtrl', StockEditCtrl);

    StockEditCtrl.$inject = ['$stateParams', '$state', '$scope', '$timeout', 'StockService'];

    /* @ngInject */
    function StockEditCtrl($stateParams, $state, $scope, $timeout, StockService) {

      $scope.stock = null; 

        

        active();

        function active () {
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
        

        $scope.confirm = function(){
            console.log($scope.stock);
            // TODO: check if stock available!!!
            StockService.editingStock = $scope.stock;
            $state.transitionTo('stockConfirm', {stock: $scope.stock});
        }

        $scope.addItem = function () {
            $scope.stock.items.push({
                item_name: null,
                type: null,
                unit_price: null,
                unit_weight: null,
                quantity: null,
            })
        }

        $scope.deleteItem = function ($index) {
            $scope.stock.items.splice($index, 1);
        }
        

        function ifLastItemFilled(){
            // TODO: check if last item available!!!
            var index = $scope.stock.items.length();
            var lastItem = $scope.stock.items[index];
        }
    }
})();