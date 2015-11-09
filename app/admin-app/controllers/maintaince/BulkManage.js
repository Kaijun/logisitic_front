(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('BulkManage', BulkManage);

    BulkManage.$inject = ['$scope', '$timeout', 'MessageService', '$state', 'RoleService'];

    /* @ngInject */
    function BulkManage($scope, $timeout, MessageService, $state, RoleService) {
        $scope.bulkList = [];
        
        $scope.isPopupShown = false;
        $scope.roles = [];
        $scope.roleChosen = null;
        $scope.textContent = '';
        $scope.isNotification = false;
        $scope.isEmail = false;
        $scope.isSMS = false;
        $scope.popupConfirm = popupConfirm;
        $scope.popupCancle = popupCancle;
        activate();

        ////////////////

        function activate() {
            MessageService.getBulkList().then(function (data) {
                data.forEach(function (item) {
                    item.created_at = item.created_at.substring(0, 10);
                })
                $scope.bulkList = data;
            }).then(function () {
                RoleService.getRoles().then(function (data) {
                    $scope.roles = data;
                    $scope.roleChosen = $scope.roles[0];
                })
            });
        }

        function popupConfirm () {
            if(($scope.isNotification===false&&$scope.isEmail===false&&$scope.isSMS===false) || $scope.textContent.length===0 || $scope.roleChosen===null){
                alert('请填写必要信息!');
                return;
            }
            MessageService.sendBulkMsg({
                send_by_role:1,
                roles:[$scope.roleChosen.id], 
                content: $scope.textContent, 
                send_notification: $scope.isNotification, 
                send_email: $scope.isEmail,
                send_sms: $scope.isSMS
            }).then(function (data) {
                if(data.success===true){
                    swal('群发消息成功', "", "success");
                    $state.go($state.current, {}, {reload: true});
                }

            })
        }
        function popupCancle () {
            $scope.isPopupShown = false;
        }
    }
})();