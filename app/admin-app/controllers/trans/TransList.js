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
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    TransService.deleteTrans(trans.transorder_id).then(function(data) {
                        $scope.transs.map(function (item, index, arry) {
                            if(item === trans){
                                arry.splice(index, 1);
                            }
                        })
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
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }
    }
})();