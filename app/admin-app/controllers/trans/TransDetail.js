(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TransDetail', TransDetail);

    TransDetail.$inject = ['$scope', '$stateParams', '$timeout', 'TransService', 'InfoService', '$state', '$window'];

    /* @ngInject */
    function TransDetail($scope, $stateParams, $timeout, TransService, InfoService, $state, $window) {
        $scope.trans = null;
        $scope.submitTrans = submitTrans;
        $scope.printTrans = printTrans;
        $scope.$stateParams = $stateParams;
        activate();

        ////////////////

        function activate() {
            if($stateParams.transId){
                TransService.getTrans($stateParams.transId).then(function(data) {
                    $timeout(function () {
                        $scope.trans = data;
                        $scope.trans.created_time.date = data.created_time.date.substring(0, 10);
                        $scope.trans.updated_time.date = data.updated_time.date.substring(0, 10);
                        $scope.trans.statusStr = InfoService.getStockStatusMapping(data.status);
                    })
                    return data;
                })
            }
        }

        function submitTrans () {
            TransService.editTrans($stateParams.transId, {
                status: 10
            }).then(function (response) {
                $state.go($state.current, {transId: $stateParams.transId}, {reload: true});
            })
        }
        function printTrans () {

            if($scope.trans.status == 7){

                swal({
                    title: "已打印?",
                    text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    
                    TransService.editTrans($stateParams.transId, {
                        status: 8
                    }).then(function (response) {
                        $state.go($state.current, {transId: $stateParams.transId}, {reload: true});
                    })
                })

                    $window.localStorage.setItem('printTransData', angular.toJson($scope.trans));
                    var url = $state.href('printTrans');
                    var newWindow = $window.open(url,'_blank');
            }
            else{

                    $window.localStorage.setItem('printTransData', angular.toJson($scope.trans));
                    var url = $state.href('printTrans');
                    var newWindow = $window.open(url,'_blank');
            }
            
        }
    }
})();