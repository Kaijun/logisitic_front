(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ExtraSrvManage', ExtraSrvManage);

    ExtraSrvManage.$inject = ['$scope', '$timeout', 'ExtraSrvService', 'LogisticService', 'RoleService', '$state', '$stateParams', '$window', '$q', '$filter'];

    /* @ngInject */
    function ExtraSrvManage($scope, $timeout, ExtraSrvService, LogisticService, RoleService, $state, $stateParams, $window, $q, $filter) {

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

            var logisticsPromise = LogisticService.getLogistics().then(function (data) {
                data = [{id: -1, name: '全部'}].concat(data);
                $scope.allLogisticPaths = data;
                $scope.chosenLogisticPath = $scope.allLogisticPaths[0];
            });
            var rolesPromise = RoleService.getRoles().then(function (data) {
                data = [{id: 0, role_name: '全部'}].concat(data);
                $scope.allRoles = data;
                $scope.chosenRole = $scope.allRoles[0];
            });
            $q.all([logisticsPromise, rolesPromise]).then(function () {
                if($stateParams.id){
                    ExtraSrvService.getExtraSrv($stateParams.id).then(function (data) {

                        //重新组装/转换 选择的项目
                        $scope.chosenRole = $filter('filter')($scope.allRoles, {id: data[0].user_group})[0];
                        $scope.chosenLogisticPath = $filter('filter')($scope.allLogisticPaths, {id: data[0].logistic_path_id})[0];
                        data[0].type = data[0].type.toString();
                        data[0].based_on = data[0].based_on.toString();
                        $scope.ladders = data[0].price_ladder;
                        
                        $timeout(function () {
                            $scope.extraSrv = data[0];
                            isEditing = true;
                        })
                    });
                }
                else{
                    $timeout(function () {
                        $scope.extraSrv = angular.copy(extraSrvObj);
                    })
                }
            })


        }

        function submit () {
            $scope.extraSrv.price_ladders = $scope.ladders;
            $scope.extraSrv.logistic_path_id = $scope.chosenLogisticPath.id;
            $scope.extraSrv.user_group = $scope.chosenRole.id;
            if(isEditing){
                ExtraSrvService.editExtraSrv($stateParams.id, $scope.extraSrv).then(function (data) {
                    if(data.success===true){
                        swal('修改成功', '', 'success');
                        $state.go('extraSrvList', {}, {reload: true});
                    }
                })
            }
            else{
                
                ExtraSrvService.submitExtraSrv($scope.extraSrv).then(function (data) {
                    if(data.success===true){
                        swal('添加成功', '', 'success');
                        $state.go('extraSrvList', {}, {reload: true});
                    }
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
            var index = $scope.ladders.indexOf(ladder);
            if(index>-1)
                $scope.ladders.splice(index, 1);
        }
        function editLadder (ladder) {
            swal({
                title: "修改梯度范围价格",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: true,
                inputPlaceholder: ladder.unit_price 
            }, function(inputValue){   
                if (inputValue === false) 
                    return false;      
                if (inputValue === "") {     
                    swal.showInputError("请填写此范围的价格");     
                    return false   
                }      
                $timeout(function () {
                    ladder.unit_price = inputValue;
                })
            });
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