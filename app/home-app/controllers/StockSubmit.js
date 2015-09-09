
'use strict';
;(function () {
    
    angular.module('home.controllers')
    .controller('StockSubmitCtrl', ['$scope', 'StockService', 'InfoService', '$state', '$stateParams', '$timeout', '$q', 
    function($scope, StockService, InfoService, $state, $stateParams, $timeout, $q) {
        var stockObj = {
            warehouse: null,
            desc: null,
            ship_company: null,
            ship_tracknumber: null,
            status: null,
            timestamp: null,
            items: [],
            image_1: null,
            image_2: null,
            image_3: null,
            message: null,
            extra_services: [],
            weight: null,
            web_link: null,
            website_reference: null,
        }
        $scope.stock = null; 
        $scope.warehouses = [];
        $scope.logisticPaths = [];
        $scope.extraServicesName = [];
        $scope.imagesToUpload = [];
        $scope.isConfirmShown = false;
        $scope.confirmSubmit = confirmSubmit;
        $scope.editSubmit = editSubmit;
        $scope.deleteSubmit = deleteSubmit;

        var isImagesChanged = false;
        var isEditMode = false;

        active();

        function active () {
            var warehousePromise = InfoService.getWarehouses().then(function (data){
                $scope.warehouses = data;
            });
            var pathPromise = InfoService.getLogisticPaths(0).then(function (data){
                $scope.logisticPaths = data;
            });

            $q.all([warehousePromise, pathPromise]).then(function () {
                $timeout(function(){
                    if(!$stateParams.stockId){
                        $scope.stock = angular.copy(stockObj);
                        $scope.stock.warehouse = $scope.warehouses[0].id.toString();
                        $scope.stock.ship_company = $scope.logisticPaths[0].id.toString();
                    }
                    else{
                        isEditMode = true;
                        StockService.getStock($stateParams.stockId).then(function(data){
                            $scope.stock = data;
                            $scope.stock.warehouse = $scope.warehouses[0].id.toString();
                            $scope.stock.ship_company = $scope.logisticPaths[0].id.toString();
                        },
                        // 非法
                        function(){
                            $state.go('index');
                        })
                    }
                });
            });

            //监察Images是否改变...
            $scope.$watch('imagesToUpload', function (newValue, oldValue) {
                if(newValue === oldValue) return;
                debugger;
                isImagesChanged = true;
            }, true);
            
        }
        

        $scope.confirm = function(){
            // TODO: check if stock available!!!
            console.log($scope.stock);
            console.log($scope.extraServicesName);

            //upload Images
            if(isImagesChanged){
                var deferred = $q.defer();
                var promises = []; 
                $scope.imagesToUpload.forEach(function (image, index) {
                    var promise = InfoService.uploadImage(image).then(function(data){
                        if(data.success=='true')
                            $scope.stock['image_'+(index+1)] = data.file_name;
                    });
                    promises.push(promise);
                });
                $q.all(promises).then(function(){
                    $timeout(function () {
                        isImagesChanged = false;
                        toggleConfirmView();
                    });
                });
            }
            else{
                toggleConfirmView();
            }
            
            
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

        function toggleConfirmView(){
            $scope.isConfirmShown = !$scope.isConfirmShown;
        }

        function confirmSubmit () {
            console.log($scope.stock);
            if($stateParams.stockId && isEditMode){
                StockService.submitStock($stateParams.stockId, $scope.stock).then(function (data) {
                    if(data.package_id && data.success==="true"){
                        $state.go('stockDetail', {stockId: $stateParams.stockId});
                    }
                });
            }
            else{
                StockService.submitStock($scope.stock).then(function (data) {
                    if(data.package_id && data.success==="true"){
                        $state.go('stockDetail', {stockId: data.package_id});
                    }
                });
            }
        }

        function editSubmit () {
            $scope.isConfirmShown = false;
        }

        function deleteSubmit () {
            $state.go('stockSubmit', {}, { reload: true });
        }

    }]);
})();