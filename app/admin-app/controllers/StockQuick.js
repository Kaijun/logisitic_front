(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockQuickCtrl', StockQuickCtrl);


    /* @ngInject */
    function StockQuickCtrl($scope, StockService, UserService, RoleService, $timeout, InfoService, $state) {
        var TIMEOUT_DELAY = 500;
        $scope.stock = null;
        $scope.serachText = null;
        $scope.submitData = {
            stock_number: null,
            warehouse_id: null,
            reference_code: null,
            need_check: null, //1-需要验证, 0-不需要验证
            weight: null,
        }
        $scope.userFound = null;
        $scope.isRequested = false;
        $scope.isStockFound = false;
        $scope.warehouses = [];
        $scope.warehouseChosen = [];
        $scope.roles = [];
        $scope.search = search;
        $scope.enterStock = enterStock;
        $scope.regStock = regStock;

        activate();

        ////////////////
        function activate() {
            var searchStockTimeout;
            $scope.$watch('serachText', function (newValue, oldValue) {
                if(newValue === oldValue) return;

                if (searchStockTimeout) $timeout.cancel(searchStockTimeout);
                searchStockTimeout = $timeout(function() {
                    search();
                }, TIMEOUT_DELAY); 
            });

            var searchUserimeout;
            $scope.$watch('submitData.stock_number', function (newValue, oldValue) {
                if(newValue === oldValue) return;
                if (searchUserimeout) $timeout.cancel(searchUserimeout);
                searchUserimeout = $timeout(function() {
                    UserService.getUserByStockNumber($scope.submitData.stock_number).then(function (data) {
                        if(data.success==true){
                            $scope.userFound = data.user;
                            $scope.userFound.roleName = $scope.roles.filter(function (item) {
                                return item.id == data.user.role_id;
                            })[0].role_name
                        }
                        else{
                            $scope.userFound = null;
                        }
                    });
                }, TIMEOUT_DELAY*2); 
            });

            InfoService.getWarehouses().then(function (data) {
                $scope.warehouses = data;
                $scope.warehouseChosen = data[0];
            });
            RoleService.getRoles().then(function (data) {
                $scope.roles = data;
            });
        }

        function search() {
            if($scope.serachText){
                StockService.getStockByTrackNr($scope.serachText).then(function (data) {
                    $scope.isRequested = true;
                    if(data.package==null){
                        $scope.isStockFound = false;
                        $scope.submitData.reference_code = $scope.serachText;
                    }
                    else{
                        $scope.isStockFound = true;
                        data = data.package;
                        data.createTimeString = data.created_time.date.substring(0, 10);
                        data.updateTimeString = data.updated_time.date.substring(0, 10);
                        data.statusStr = InfoService.getStockStatusMapping(data.status);
                        $timeout(function(){
                            $scope.stock = data;
                        });
                    }
                });
            }
        }

        function enterStock () {
            if($scope.stock.package_id){
                StockService.enterStock($scope.stock.package_id).then(function(data) {
                    $state.go('stockDetail', {stockId: data.package_id});
                });
            }
        }

        function goToDetail () {
            $state.go('stockDetail', {stockId: $scope.stock.package_id});
        }

        function regStock () {
            $scope.submitData.need_check = $scope.submitData.need_check?1:0;
            $scope.submitData.warehouse_id = $scope.warehouseChosen.id;
            StockService.submitStock($scope.submitData).then(function(data) {
                $state.go('stockDetail', {stockId: data.package_id});
            })
        }
    }
})();