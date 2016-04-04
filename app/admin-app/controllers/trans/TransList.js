(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TransList', TransList);

    TransList.$inject = ['$scope', 'TransService', '$timeout', '$state', '$http', 'StockService', 'InfoService'];

    /* @ngInject */
    function TransList($scope, TransService, $timeout, $state, $http, StockService, InfoService) {
        $scope.StockService = StockService;
        $scope.transs = [];
        $scope.statuses = Array.apply(null, Array(5)).map(function(item, index) {
            return {
                name: InfoService.getStockStatusMapping(index+6),
                value: index+6
            }
        })
        $scope.statuses.unshift({name: '', value: null});
        $scope.filterOptions = {
            status: $scope.statuses[0].value,
            reference_code: null,
            from_stock_number: null,
            to_stock_number: null,
            start: null,
            end: null,
        };

        $scope.filter = filter;
        $scope.clearFilter = clearFilter;
        
        $scope.goToDetail = goToDetail;
        $scope.deleteTrans = deleteTrans;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            TransService.getTranss().then(function(data){
                if(data.success===true){
                    data = data.data
                    $scope.transs = data.data;
                    $scope.transs = $scope.transs.filter(function (item) {
                        return item.transorder_id;
                    });
                    $scope.transs.map(function (item) {
                        item.statusStr = InfoService.getStockStatusMapping(item.status);
                        item.created_at = item.created_time.date.substring(0, 10);
                        item.updated_at = item.updated_time.date.substring(0, 10);
                        // item.selected = arrayExist(selectedOrders, item);
                    })
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function goToDetail (transId) {
            $state.go('transDetail', {transId: transId});
        }
        function deleteTrans (trans) {
            if(trans.transorder_id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    TransService.deleteTrans(trans.transorder_id).then(function(data) {
                        if(data.success===true){
                            swal("删除成功", "", "success");
                            $scope.transs.map(function (item, index, arry) {
                                if(item === trans){
                                    arry.splice(index, 1);
                                }
                            })
                        }
                    });
                })
            }
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                response = response.data
                if(response.success===true){
                    $scope.transs = response.data.data;                
                    $scope.transs = $scope.transs.filter(function (item) {
                        return item.transorder_id;
                    });                
                    $scope.transs.map(function (item) {
                        item.statusStr = InfoService.getStockStatusMapping(item.status);
                        item.created_at = item.created_time.date.substring(0, 10);
                        // item.selected = arrayExist(selectedOrders, item);
                    })
                    $timeout(function () {
                        $scope.pageInfo = response.data;
                    })
                }
            })
        }
        function filter() {
            var opt = angular.copy($scope.filterOptions);
            if(opt.start instanceof Date && opt.end instanceof Date && opt.start>opt.end){
                swal('起始时间不能晚于截至时间', '', 'error')
                return 
            }
            if(opt.start instanceof Date) opt.start = opt.start.toISOString().substr(0,10);
            if(opt.end instanceof Date) opt.end = opt.end.toISOString().substr(0,10);
            TransService.queryTranss(opt).then(function(data) {
                if(data.success===true){
                    data = data.data
                    $scope.transs = data.data;
                    $scope.transs = $scope.transs.filter(function (item) {
                        return item.transorder_id;
                    });
                    $scope.transs.map(function (item) {
                        item.statusStr = InfoService.getStockStatusMapping(item.status);
                        item.created_at = item.created_time.date.substring(0, 10);
                        item.updated_at = item.updated_time.date.substring(0, 10);
                        // item.selected = arrayExist(selectedOrders, item);
                    })
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function clearFilter() {
            $state.go($state.current, {}, {reload: true})
        }
    }
})();