(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('BulkManage', BulkManage);

    BulkManage.$inject = ['$scope', '$timeout', 'MessageService', '$state', 'RoleService'];

    /* @ngInject */
    function BulkManage($scope, $timeout, MessageService, $state, RoleService) {

        var TIMEOUT_DELAY = 500;

        $scope.bulkList = [];
        
        $scope.isPopupShown = false;
        $scope.roles = [];
        $scope.roleChosen = null;
        $scope.textContent = '';
        $scope.isNotification = false;
        $scope.isEmail = false;
        $scope.isSMS = false;
        $scope.select = {
            sendByRole: 1,
        };
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

            $scope.$watch('select.sendByRole', function (newValue, oldValue) {
                if(newValue==0){
                    //selectize
                    var searchUserTimeout;
                    $timeout(function () {
                        $('#user-tags').selectize({
                            persist: false,
                            maxItems: null,
                            valueField: 'id',
                            labelField: 'name',
                            searchField: ['name'],
                            searchConjunction: 'or',
                            options: [
                                {id: 1, name: 'Brian Reavis', email: "123@gmail.com"},
                                {id: 2, name: 'Kaijun Chen', email: "123@gmail.com"},
                                {id: 3, name: 'Pu Junyu', email: "123@gmail.com"},
                                {id: 4, name: 'Hehehu', email: "123@gmail.com"},
                                {id: 5, name: 'Sun Jun', email: "123@gmail.com"},
                            ],
                            render: {
                                item: function(item, escape) {
                                    return '<div>' +
                                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                                        (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
                                    '</div>';
                                },
                                option: function(item, escape) {
                                    var label = item.name || item.email;
                                    var caption = item.name ? item.email : null;
                                    return '<div>' +
                                        '<span class="label">' + escape(label) + '</span>' +
                                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                                    '</div>';
                                }
                            },
                            onType: function (input) {
                                var self = this;
                                if (searchUserTimeout) $timeout.cancel(searchUserTimeout);
                                searchUserTimeout = $timeout(function() {
                                    // search();
                                    var options = [
                                        {id: 7, name: 'etwas anderes', email: "123@gmail.com"},
                                        {id: 8, name: 'etwas anderes', email: "123@gmail.com"},
                                        {id: 9, name: 'etwas anderes', email: "123@gmail.com"},
                                        {id: 10, name: 'etwas anderes', email: "123@gmail.com"},
                                        {id: 11, name: 'etwas anderes', email: "123@gmail.com"},
                                    ];
                                    self.addOption(options);
                                    self.refreshOptions(true);



                                }, TIMEOUT_DELAY); 
                            },

                        });
                        
                    })
                }
                else if(newValue == 1){

                }
            })
            
            
        }

        function popupConfirm () {
            if(($scope.isNotification===false&&$scope.isEmail===false&&$scope.isSMS===false) || $scope.textContent.length===0 || $scope.roleChosen===null){
                alert('请填写必要信息!');
                return;
            }
            MessageService.sendBulkMsg({
                send_by_role: $scope.select.sendByRole,
                roles: $scope.select.sendByRole==1?[]:[], 
                users: $scope.select.sendByRole==0?[]:[], 
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