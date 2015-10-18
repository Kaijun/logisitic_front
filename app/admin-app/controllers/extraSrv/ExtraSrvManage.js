(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ExtraSrvManage', ExtraSrvManage);

    ExtraSrvManage.$inject = ['$scope', '$timeout', 'ExtraSrvService', 'LogisticService', 'RoleService', '$state', '$stateParams', '$window'];

    /* @ngInject */
    function ExtraSrvManage($scope, $timeout, ExtraSrvService, LogisticService, RoleService, $state, $stateParams, $window) {

        var isEditing = false;

        var extraSrvObj = {
            service_name: null,
            type: "0",
            user_group: "0",
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
        $scope.allLogisticPaths = [];
        $scope.chosenLogisticPath = null;
        $scope.allRoles = [];
        $scope.chosenRole = null;

        $scope.submit = submit;
        $scope.addLadder = addLadder;
        $scope.deleteLadder = deleteLadder;
        $scope.editLadder = editLadder;
        $scope.popupConfirm = popupConfirm;
        $scope.popupCancle = popupCancle;

        activate();

        ////////////////

        function activate() {

            LogisticService.getLogistics().then(function (data) {
                data = [{id: -1, name: '全部'}].concat(data);
                $scope.allLogisticPaths = data;
                $scope.chosenLogisticPath = $scope.allLogisticPaths[0];
            });
            RoleService.getRoles().then(function (data) {
                data = [{id: 0, role_name: '全部'}].concat(data);
                $scope.allRoles = data;
                $scope.chosenRole = $scope.allRoles[0];
            });

            if($stateParams.id){
                ExtraSrvService.getExtraSrv($stateParams.id).then(function (data) {
                    $timeout(function () {
                        $scope.extraSrv = data[0];
                        $scope.ladders = data[0].price_ladders;
                        isEditing = true;
                    })
                });
            }
            else{
                $timeout(function () {
                    $scope.extraSrv = angular.copy(extraSrvObj);
                })
            }


        }

        function submit () {
            $scope.extraSrv.price_ladders = $scope.ladders;
            $scope.extraSrv.logistic_path_id = $scope.chosenLogisticPath.id;
            $scope.extraSrv.user_group = $scope.chosenRole.id;
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

       $scope.goBack = function () {
            $window.history.back();
        }
    }
})();