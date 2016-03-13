(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticManage', LogisticManage);

    LogisticManage.$inject = ['$scope', '$timeout', 'LogisticService', 'RoleService', '$state', '$stateParams', '$q', '$filter'];

    /* @ngInject */
    function LogisticManage($scope, $timeout, LogisticService, RoleService, $state, $stateParams, $q, $filter) {
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

            var ltPromise = LogisticService.getLogisticTypes().then(function (data) {
                data.map(function (item) {
                    item.selected = false;
                });
                $scope.logisticTypes = data;
            });

            var rolesPromise = RoleService.getRoles().then(function (data) {
                data = [{id: 0, role_name: '全部'}].concat(data);
                $scope.allRoles = data;
                $scope.chosenRole = $scope.allRoles[0];
            });

            $q.all([ltPromise, rolesPromise]).then(function () {
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

                        //重新组装/转换 选择的项目
                        $scope.chosenRole = $filter('filter')($scope.allRoles, {id: data[0].user_group})[0];
                        data[0].type = data[0].type.toString();
                        data[0].based_on = data[0].based_on.toString();
                        $scope.ladders = data[0].price_ladder;
                        
                        $timeout(function () {
                            $scope.logisticPath = data[0];
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
            })

            

        }

        function submit () {
            $scope.logisticPath.price_ladders = $scope.ladders;
            if(!isLadderValid($scope.ladders, $scope.logisticPath.weight_upper_bound)){
                swal('请填写正确的价格梯度, 梯度应该涵盖重量上限', '', 'error');
                return;
            }
            $scope.logisticPath.user_group = $scope.chosenRole.id;
            if(isEditing){
                LogisticService.editLogistic($stateParams.id, $scope.logisticPath).then(function (data) {
                   if(data.success===true){
                        swal('修改成功', '', 'success');
                        $state.go('logisticList', {}, {reload: true});
                   }
                })
            }
            else{
                LogisticService.submitLogistic($scope.logisticPath).then(function (data) {
                    if(data.success===true){
                        swal('添加成功', '', 'success');
                        $state.go('logisticList', {}, {reload: true});
                   }
                })
            }
        }

        function isLadderValid(ladders, weightUp) {
            return parseInt(ladders[ladders.length-1].upper_bound) >= parseInt(weightUp);
        }

        function addLadder () {
            $scope.isPopupShown = true;
            if($scope.ladders.length===0){
                $scope.ladderFrom = 0;
            }
            else{
                $scope.ladderFrom = $scope.ladders[$scope.ladders.length-1].upper_bound;
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
                if($scope.ladders.length===0 || parseInt($scope.ladderTo) > parseInt($scope.ladders[$scope.ladders.length-1].upper_bound)){
                    $scope.ladders.push({
                        upper_bound: $scope.ladderTo,
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