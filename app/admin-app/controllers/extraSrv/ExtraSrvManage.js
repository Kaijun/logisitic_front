(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ExtraSrvManage', ExtraSrvManage);

    ExtraSrvManage.$inject = ['$scope', '$timeout', 'ExtraSrvService', '$state', '$stateParams'];

    /* @ngInject */
    function ExtraSrvManage($scope, $timeout, ExtraSrvService, $state, $stateParams) {

        var isEditing = false;

        var extraSrvObj = {
            service_name: null,
            type: "3",
            user_group: null,
            description: null,
            based_on: "0",
            base_price: null,
            logistic_path_id: "-1",
            price_ladders: [],
        }



        $scope.isPopupShown = false;
        $scope.ladderFrom = null;
        $scope.ladderTo = null;
        $scope.ladderPrice = null;

        $scope.extraSrv = null;
        $scope.roles = '';
        $scope.ladders = [];

        $scope.submit = submit;
        $scope.addLadder = addLadder;
        $scope.deleteLadder = deleteLadder;
        $scope.editLadder = editLadder;
        $scope.popupConfirm = popupConfirm;
        $scope.popupCancle = popupCancle;

        activate();

        ////////////////

        function activate() {

            if($stateParams.id){
                ExtraSrvService.getExtraSrv($stateParams.id).then(function (data) {

                    $timeout(function () {
                        $scope.extraSrv = data[0];
                        $scope.ladders = data[0].price_ladders;
                        isEditing = true;
                    })
                })
            }
            else{
                $timeout(function () {
                    $scope.extraSrv = angular.copy(extraSrvObj);

                })
            }


        }

        function submit () {
            $scope.extraSrv.price_ladders = $scope.ladders;
            if(isEditing){
                ExtraSrvService.editExtraSrv($stateParams.id, $scope.extraSrv).then(function (data) {
                    if(data.success===true)
                        swal({
                            type: "success",
                            title: "修改成功!",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: true,
                        }, function () {
                            $state.go('extraSrvList', {}, {reload: true});
                        })
                })
            }
            else{
                
                ExtraSrvService.submitExtraSrv($scope.extraSrv).then(function (data) {
                    if(data.success===true)
                        swal({
                            type: "success",
                            title: "添加成功!",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: true,
                        }, function () {
                            $state.go('extraSrvList', {}, {reload: true});
                        })
                })
            }
        }

        function addLadder () {
            $scope.isPopupShown = true;
            if($scope.ladders.length===0){
                $scope.ladderFrom = 0;
            }
            else{
                $scope.ladderFrom = $scope.ladders[$scope.ladders.length-1].lower_bound;
            }
        }
        function deleteLadder (ladder) {
            // body...
        }
        function editLadder (ladder) {
            // body...
        }

        function popupConfirm () {
            if($scope.ladderTo && $scope.ladderPrice){
                if($scope.ladders.length===0 || parseInt($scope.ladderTo) > parseInt($scope.ladders[$scope.ladders.length-1].lower_bound)){
                    $scope.ladders.push({
                        lower_bound: $scope.ladderTo,
                        unit_price: $scope.ladderPrice,
                    });
                    popupCancle();
                }
            }

        }
        function popupCancle () {
            $scope.ladderFrom = null;
            $scope.ladderTo = null;
            $scope.ladderPrice = null;
            $scope.isPopupShown = false;
        }
    }
})();