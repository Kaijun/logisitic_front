(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('StockConfirmCtrl', StockConfirmCtrl);

    StockConfirmCtrl.$inject = ['$stateParams', '$state', '$scope', '$timeout', 'StockService', '$rootScope'];

    /* @ngInject */
    function StockConfirmCtrl($stateParams, $state, $scope, $timeout, StockService, $rootScope) {
        
        $scope.stock = null;
        $scope.deleteSubmit = deleteSubmit;
        $scope.editSubmit = editSubmit;
        $scope.confirmSubmit = confirmSubmit;

        activate();

        ////////////////

        function activate() {

            if($stateParams.stock === null){
                $state.go('index');
            }
            else{
                $timeout(function(){
                    $scope.stock = $stateParams.stock;
                });
            }

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if(toState.name !== 'stockSubmit'){
                    clearEdittingStock();
                }
            });
        }

        function editSubmit () {
            if(StockService.editingStockId){
                $state.go('stockSubmit', {action: 'edit', stockId: StockService.editingStockId});
            }
            else{
                $state.go('stockSubmit');
            }
        }

        function deleteSubmit () {
            clearEdittingStock();
            $state.go('index');
        }
        function confirmSubmit () {
            if(StockService.editingStockId){
                StockService.editStock(StockService.editingStockId, $scope.stock).then(function (data) {
                    if(data.package_id && data.success==="true"){
                        clearEdittingStock()
                        $state.go('stockDetail', {stockId: data.package_id});
                    }
                });

            }
            else{
                StockService.submitStock($scope.stock).then(function (data) {
                    if(data.package_id && data.success==="true"){
                        clearEdittingStock()
                        $state.go('stockDetail', {stockId: data.package_id});
                    }
                });
            }
        }
        function clearEdittingStock(){
            StockService.editingStock = null;
            StockService.editingStockId = null;
        }

    }
})();