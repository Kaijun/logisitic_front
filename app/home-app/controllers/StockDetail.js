(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['StockService', 'InfoService', 'AppConfig', '$q', '$scope', '$timeout', '$stateParams', '$state', '$window'];

    /* @ngInject */
    function StockDetailCtrl(StockService, InfoService, AppConfig, $q, $scope, $timeout, $stateParams, $state, $window) {

        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        $scope.stock = null;

        $scope.deleteStock = deleteStock;
        $scope.editStock = editStock;
        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        $scope.warehouses = [];
        $scope.logisticPaths = [];
        $scope.extraServices = [];

        $scope.imagesToUpload = [];
        $scope.isStockEditable = false;

        activate();

        ////////////////

        function activate() {
            var warehousePromise = InfoService.getWarehouses().then(function (data){
                $scope.warehouses = data;
            });
            // var pathPromise = InfoService.getLogisticPaths(0).then(function (data){
            //     $scope.logisticPaths = data;
            // });
            // TODO: add user Group!!! from UserInfo
            var extraSrvPromise = InfoService.getExtraServices(1, 0).then(function (data){
                 $scope.extraServices = data;
            });
            $q.all([warehousePromise, extraSrvPromise]).then(function () {

               if($stateParams.stockId){
                    var stockId = $stateParams.stockId;
                    StockService.getStock(stockId).then(function (data) {
                        $scope.isStockEditable = (data.status==1 || data.status==2);
                        return data;
                    }).then(function(data){
                        data.created_at = data.created_at.substring(0, 10);
                        data.updated_at = data.updated_at.substring(0, 10);
                        data.statusStr = InfoService.getStockStatusMapping(parseInt(data.status));
                        data.warehouseStr = $scope.warehouses.filter(function(wh){
                            return parseInt(wh.id) === parseInt(data.warehouse_id)
                        })[0].name;
                        data.items.map(function (item) {
                            InfoService.getTypeById(item.type).then(function (data) {
                                item.typeName = data.type_name;
                            });
                        })
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
            // $state.go('stockSubmit', {stockId: $stateParams.stockId});
            if($scope.stock.need_check){
                uploadImg().then(function () {
                    StockService.editStock($stateParams.stockId, $scope.stock).then(function (data) {
                        if(data.success===true){
                            swal({
                                title: "修改成功",    
                                text: "等待管理员审核", 
                                confirmButtonText: "返回",
                                type: "success"
                            }, function () {
                                $state.go('stockList', {}, {reload: true});
                            })
                        }
                    })
                });
            }
            else{
                StockService.editStock($stateParams.stockId, $scope.stock).then(function (data) {
                    if(data.success===true){
                        swal({
                            title: "修改成功",    
                            text: "等待管理员审核", 
                            confirmButtonText: "返回",
                            type: "success"
                        }, function () {
                            $state.go('stockList', {}, {reload: true});
                        })
                    }
                })
            }

        }
        function deleteStock () {
            StockService.deleteStock($stateParams.stockId).then(function() {
                $state.go('stockList');
            }, function () {
                // body...
            })
        }

        function uploadImg () {
            var deferred = $q.defer();
            var promises = []; 
            $scope.imagesToUpload.forEach(function (image, index) {
                var promise = InfoService.uploadImage(image).then(function(data){
                    if(data.success === true ) 
                        $scope.stock['image_'+(index+1)] = data.file_name;
                });
                promises.push(promise);
            });
            return $q.all(promises)
        }
        $scope.goBack = function () {
            $window.history.back();
        }
    }
})();