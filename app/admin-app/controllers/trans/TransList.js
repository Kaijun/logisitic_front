(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TransList', TransList);

    TransList.$inject = ['$scope', 'TransService', '$timeout', '$state', '$http', 'StockService'];

    /* @ngInject */
    function TransList($scope, TransService, $timeout, $state, $http, StockService) {
        $scope.StockService = StockService;
        $scope.transs = [];
        $scope.goToDetail = goToDetail;
        $scope.deleteTrans = deleteTrans;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            TransService.getTranss().then(function(data){
                $scope.transs = data.data;
                $scope.transs = $scope.transs.filter(function (item) {
                    return item.transorder_id;
                });
                $scope.transs.map(function (item) {
                    item.statusStr = StockService.getStockStatusMapping(item.status);
                    item.created_at = item.created_time.date.substring(0, 10);
                    // item.selected = arrayExist(selectedOrders, item);
                })
                $timeout(function () {
                    $scope.pageInfo = data;
                })
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
                $scope.transs = response.data.data;                
                $scope.transs = $scope.transs.filter(function (item) {
                    return item.transorder_id;
                });                
                $scope.transs.map(function (item) {
                    item.statusStr = StockService.getStockStatusMapping(item.status);
                    item.created_at = item.created_time.date.substring(0, 10);
                    // item.selected = arrayExist(selectedOrders, item);
                })
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }
    }
})();