(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticType', LogisticType);

    LogisticType.$inject = ['$scope', '$state', '$timeout', 'LogisticService'];

    /* @ngInject */
    function LogisticType($scope, $state, $timeout, LogisticService) {

        $scope.logisticTypes = [];
        $scope.isPopupShown = false;
        $scope.typeName = '';

        $scope.deleteLogisticType = deleteLogisticType;
        $scope.addLogisticType = addLogisticType;
        $scope.cancle = cancle;
        $scope.submitLogisticType = submitLogisticType;

        activate();

        ////////////////

        function activate() {
            LogisticService.getLogisticTypes().then(function (data) {
                $timeout(function (argument) {
                    $scope.logisticTypes = data;
                })
                
            })
        }        
        function deleteLogisticType(lt){
            swal({
                title: "确认删除?",
                showCancelButton: true,
            }, function () {
                LogisticService.deleteLogisticType(lt.id).then(function (data) {
                    $scope.logisticTypes.forEach(function (item, idx, arry) {
                        if(item.id == lt.id){
                            arry.splice(idx, 1);
                        }
                    })
                })
            })
        }

        function addLogisticType () {
            $scope.isPopupShown = true;
        }
        function cancle () {
            $scope.isPopupShown = false;
        }
        function submitLogisticType () {
            if($scope.typeName){
                LogisticService.submitLogisticType({type_name: $scope.typeName}).then(function (data) {
                    $scope.isPopupShown = false;
                    swal('添加成功', '', 'success');
                    $state.go($state.current, {}, {reload: true})
                })
            }
        }
    }
})();