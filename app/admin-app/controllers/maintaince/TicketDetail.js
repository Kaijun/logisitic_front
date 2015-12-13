(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TicketDetail', TicketDetail);

    TicketDetail.$inject = ['$scope', '$timeout', '$state', 'TicketService', '$stateParams', 'UserInfo'];

    /* @ngInject */
    function TicketDetail($scope, $timeout, $state, TicketService, $stateParams, UserInfo) {
        
        $scope.ticket = null;
        $scope.isAssignShown = false;
        $scope.isReplyPopupShown = false;

        $scope.userId = UserInfo.id;
        $scope.backendUsers = [];
        $scope.backendUserChosen = $scope.backendUsers[0];

        activate();

        ////////////////

        function activate() {
            if(!$stateParams.id) $state.go('ticketList', {}, {reload: true});

            TicketService.getBackendUserList().then(function (data) {
                $scope.backendUsers = data;
                //默认选择自己
                $scope.backendUserChosen = data.filter(function (item) {
                    return parseInt(UserInfo.id) === parseInt(item.id);
                })[0] || data[0];
            })

            TicketService.getTicket($stateParams.id).then(function (data) {
                data.statusStr = (function () {
                    switch(data.status){
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
                $scope.ticket = data;
            })
        }

        $scope.assignShow = function () {
            $scope.isAssignShown = true;
        }
        $scope.cancleAssign = function () {
            $scope.isAssignShown = false;
        }
        $scope.assign = function () {
            if($stateParams.id){
                TicketService.assignTicket($stateParams.id, $scope.backendUserChosen.id).then(function (data) {
                    if(data.success){
                        swal('指派成功', '', 'success');
                        $state.go($state.current, {id: $stateParams.id}, {reload: true})
                    }
                })
            }
        }

        $scope.replyShow = function () {
            $scope.isReplyPopupShown = true;
        }
        $scope.cancleReply = function () {
            $scope.replyContent = '';
            $scope.isReplyPopupShown = false;
        }
        $scope.sendMsg = function () {
            if($scope.replyContent.length>0)
            TicketService.sendMessageInConv($scope.ticket.conversation_id, {
                content: $scope.replyContent
            }).then(function (data) {
                if(data.success==true){
                    var currentdate = new Date(); 
                        var datetime =  currentdate.getFullYear() + "-"
                                        + (currentdate.getMonth()+1)  + "-" 
                                        + currentdate.getDate() + " "  
                                        + ("0" + currentdate.getHours()).slice(-2)  + ":"  
                                        + ("0" + currentdate.getMinutes()).slice(-2)  + ":"  
                                        + ("0" + currentdate.getSeconds()).slice(-2); 
                    $scope.ticket.conversation.messages = $scope.ticket.conversation.messages || [];
                    $scope.ticket.conversation.messages.push({
                        from: $scope.userId,
                        created_at: datetime,
                        content: $scope.replyContent
                    });
                    
                    $scope.cancleReply();
                }
            })
        }
    }
})();