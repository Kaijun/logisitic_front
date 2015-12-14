(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('NotificationCtrl', NotificationCtrl);

    NotificationCtrl.$inject = ['$scope', 'MsgService', '$timeout', '$state', 'UserInfo'];

    /* @ngInject */
    function NotificationCtrl($scope, MsgService, $timeout, $state, UserInfo) {

        $scope.$state = $state;

        $scope.userInfo = null;

        $scope.conversations = [];
        $scope.notifications = [];
        $scope.isNotificationToggled = true;

        $scope.contactMsg = {
            title: null,
            content: null,
            reference_code: null,
        }


        $scope.markConversationAsRead = markConversationAsRead;
        $scope.deleteConversation = deleteConversation;
        $scope.markNotificationAsRead = markNotificationAsRead;
        $scope.deleteNotification = deleteNotification;

        $scope.sendContact = sendContact;

        $scope.goToDetail = goToDetail;

        activate();

        ////////////////

        function activate() {

            if(UserInfo){
                $timeout(function() {
                    $scope.userInfo = UserInfo;
                })
            }

            switch($state.current.name){

                case 'notificationList':
                    MsgService.getNotifications().then(function (data) {
                        $timeout(function () {
                            $scope.notifications = data;
                        });
                    });    
                    break;

                case 'conversationList':
                    MsgService.getConversations().then(function (data) {
                        $timeout(function () {
                            $scope.isNotificationToggled = false;
                            $scope.conversations = data;
                        });
                    });
                    break;

                case 'contact':
                    break;

                default:
                    break;
            }
        }


        function goToDetail (con) {
            if(con.is_read_by_customer==0){
                markConversationAsRead(con).then(function (data) {
                    $state.go('conversation', {id: con.id});
                });
            }
            else{
                $state.go('conversation', {id: con.id});
            }
        }

        function markConversationAsRead(con){
            var promise  = MsgService.markConversationAsRead(con.id).then(function (data) {
                if(data.success === true ) 
                $timeout(function () {
                    con.is_read_by_customer = 1;
                    UserInfo.unread_conversation = UserInfo.unread_conversation>0 ? UserInfo.unread_conversation-1 : UserInfo.unread_conversation;
                })
            })
            return promise;
        }
        function deleteConversation(con){
            MsgService.deleteConversation(con.id).then(function (data) {
                if(data.success === true ) 
                $timeout(function () {
                    var idx = $scope.conversations.indexOf(con);
                    if (idx != -1) $scope.conversations.splice(idx, 1);
                })
            })
        }
        function markNotificationAsRead(noti){
           var promise = MsgService.markNotificationAsRead(noti.id).then(function (data) {
                if(data.success === true ) 
                $timeout(function () {
                    noti.is_read = 1;
                    UserInfo.unread_notification = UserInfo.unread_notification>0 ? UserInfo.unread_notification-1 : UserInfo.unread_notification;
                })
            });
           return promise;
        }
        function deleteNotification(noti){
            MsgService.deleteNotification(noti.id).then(function (data) {
                if(data.success === true ) 
                $timeout(function () {
                    var idx = $scope.notifications.indexOf(noti);
                    if (idx != -1) $scope.notifications.splice(idx, 1);
                })
            })
        }

        function sendContact() {
            if($scope.contactMsg.title && $scope.contactMsg.content){
                MsgService.contactService($scope.contactMsg).then(function (data) {
                    if(data.success===true){
                        swal('发送成功', '', 'success');
                        $state.go($state.current, {}, {reload: true})
                    }
                })
            }
        }
    }
})();