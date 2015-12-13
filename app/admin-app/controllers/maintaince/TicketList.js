(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TicketList', TicketList);

    TicketList.$inject = ['$scope', '$timeout', '$state', 'TicketService', 'UserInfo'];

    /* @ngInject */
    function TicketList($scope, $timeout, $state, TicketService, UserInfo) {
        $scope.tickets = [];

        activate();

        ////////////////

        function activate() {
            TicketService.getTicketList().then(function (data) {
                data.forEach(function (item) {
                    item.updated_at = item.updated_at.substring(0,10);
                    item.statusStr = (function () {
                        switch(item.status){
                            case 0:
                                return '未知';
                                break;
                            case 1:
                                return '未处理';
                                break;
                            case 2:
                                return '处理中';
                                break;
                            case 3:
                                return '已关闭';
                                break;
                            default: 
                                return '未知';
                                break;
                        }
                    })();
                })
                if($state.current.name == 'messageList'){
                    $scope.tickets = data;
                }
                else if($state.current.name == 'ticketList'){
                    $scope.tickets = data.filter(function (item) {
                        return parseInt(item.handler_id) === parseInt(UserInfo.id);
                    });
                }
            })
        }
    }
})();