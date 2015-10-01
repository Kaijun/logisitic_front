(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['StockService', 'InfoService', 'AppConfig', '$q', '$scope', '$timeout', '$stateParams', '$state'];

    /* @ngInject */
    function StockDetailCtrl(StockService, InfoService, AppConfig, $q, $scope, $timeout, $stateParams, $state) {
        $scope.stock = null;
        $scope.deleteStock = deleteStock;
        $scope.editStock = editStock;
        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        $scope.warehouses = [];
        $scope.logisticPaths = [];
        $scope.extraServices = [];

        activate();

        ////////////////

        function activate() {
            var warehousePromise = InfoService.getWarehouses().then(function (data){
                $scope.warehouses = data;
            });
            var pathPromise = InfoService.getLogisticPaths(0).then(function (data){
                $scope.logisticPaths = data;
            });
            // TODO: add user Group!!! from UserInfo
            var extraSrvPromise = InfoService.getExtraServices(1, 0).then(function (data){
                 $scope.extraServices = data;
            });
            $q.all([warehousePromise, pathPromise, extraSrvPromise]).then(function () {

               if($stateParams.stockId){
                    var stockId = $stateParams.stockId;
                    StockService.getStock(stockId).then(function(data){
                        
                        data.created_at = (new Date(data.created_at.date)).toISOString().substring(0, 10);
                        data.updated_at = (new Date(data.updated_at.date)).toISOString().substring(0, 10);
                        data.statusStr = InfoService.getStockStatusMapping(parseInt(data.status));
                        data.warehouseStr = $scope.warehouses.filter(function(wh){
                            return wh.id === parseInt(data.warehouse)
                        })[0].name;
                        data.items.map(function (item) {
                            InfoService.getTypeById(item.type).then(function (data) {
                                item.typeName = data.type_name;
                            });
                        })
                        try{
                            data.shipCompanyStr = $scope.logisticPaths.filter(function(lp){
                                return lp.id === parseInt(data.ship_company)
                            })[0].name;
                        }
                        catch(err){
                            console.log(err)
                        }
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
            });

        }

        function editStock () {
            $state.go('stockSubmit', {stockId: $stateParams.stockId});
        }
        function deleteStock () {
            StockService.deleteStock($stateParams.stockId).then(function() {
                $state.go('stockList');
            }, function () {
                // body...
            })
        }
    }
})();