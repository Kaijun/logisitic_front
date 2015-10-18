(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticManage', LogisticManage);

    LogisticManage.$inject = ['$scope', '$timeout', 'LogisticService', 'RoleService', '$state', '$stateParams'];

    /* @ngInject */
    function LogisticManage($scope, $timeout, LogisticService, RoleService, $state, $stateParams) {
        $scope.USER_GROUPS = ['全部用户', '普通用户', 'VIP用户'];
        
        var isEditing = false;

        var logisticPathObj = {
            name: null,
            number_ship_company: 2,
            ship_company_international: "",
            ship_company_china: "",
            options: [],
            weight_upper_bound: null,
            user_group: null,
            description: null,
            type: "0",
            based_on: "0",
            base_price: "0",
            price_ladders: [],
        }

        $scope.isPopupShown = false;
        $scope.ladderFrom = null;
        $scope.ladderTo = null;
        $scope.ladderPrice = null;
        $scope.logisticTypes = [];

        $scope.logisticPath = null;
        $scope.roles = '';
        $scope.ladders = [];

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

            LogisticService.getLogisticTypes().then(function (data) {
                data.map(function (item) {
                    item.selected = false;
                });
                $scope.logisticTypes = data;
            });

            RoleService.getRoles().then(function (data) {
                data = [{id: 0, role_name: '全部'}].concat(data);
                $scope.allRoles = data;
                $scope.chosenRole = $scope.allRoles[0];
            });

            if($stateParams.id){
                LogisticService.getLogisticById($stateParams.id).then(function (data) {
                    //重新组装options;
                    var options = [];
                    data[0].options.forEach(function (item) {
                        options.push(item.id);
                        $scope.logisticTypes.some(function (i) {
                            
                            if(i.id==item.id){
                                i.selected = true;
                                return true;
                            }
                        
                        })
                    })
                    data[0].options = options;

                    $timeout(function () {
                        $scope.logisticPath = data[0];
                        // debugger;
                        $scope.ladders = data[0].price_ladders;
                        isEditing = true;
                    })
                })
            }
            else{
                $timeout(function () {
                    $scope.logisticPath = angular.copy(logisticPathObj);
                })
            }

            $scope.$watch('logisticTypes', function (newValue, oldValue) {
                if(newValue === oldValue){
                    return ;
                }
                if($scope.logisticPath){
                    $scope.logisticPath.options = [];
                    $scope.logisticTypes.forEach(function (item) {
                        if(item.selected === true){
                            $scope.logisticPath.options.push(item.id);
                        }
                    });
                }
            }, true)

        }

        function submit () {
            $scope.logisticPath.price_ladders = $scope.ladders;
            $scope.logisticPath.user_group = $scope.chosenRole.id;
            if(isEditing){
                LogisticService.editLogistic($stateParams.id, $scope.logisticPath).then(function (dataa) {
                   if(data.success===true)
                    swal({
                        type: "success",
                        title: "添加成功!",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: true,
                    }, function () {
                        $state.go('logisticList', {}, {reload: true});
                    })
                })
            }
            else{
                LogisticService.submitLogistic($scope.logisticPath).then(function (data) {
                    if(data.success===true)
                    swal({
                        type: "success",
                        title: "修改成功!",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: true,
                    }, function () {
                        $state.go('logisticList', {}, {reload: true});
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