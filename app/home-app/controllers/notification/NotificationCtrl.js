(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('NotificationCtrl', NotificationCtrl);

    NotificationCtrl.$inject = ['$scope', 'MsgService', '$timeout', '$state', 'UserInfo'];

    /* @ngInject */
    function NotificationCtrl($scope, MsgService, $timeout, $state, UserInfo) {

        $scope.conversations = [];
        $scope.notifications = [];
        $scope.isNotificationToggled = true;

        $scope.toggleNotification = toggleNotification;
        $scope.toggleConversation = toggleConversation;

        $scope.markConversationAsRead = markConversationAsRead;
        $scope.deleteConversation = deleteConversation;
        $scope.markNotificationAsRead = markNotificationAsRead;
        $scope.deleteNotification = deleteNotification;

        $scope.goToDetail = goToDetail;

        activate();

        ////////////////

        function activate() {
            MsgService.getNotifications().then(function (data) {
                $timeout(function () {
                    $scope.notifications = data;
                });
            });
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

        function toggleNotification () {  
            $scope.isNotificationToggled = true;
        }

        function toggleConversation () {
            MsgService.getConversations().then(function (data) {
                $timeout(function () {
                    $scope.isNotificationToggled = false;
                    $scope.conversations = data;
                });
            });
        }

        function markConversationAsRead(con){
            var promise  = MsgService.markConversationAsRead(con.id).then(function (data) {
                if(data.success === true ) 
                $timeout(function () {
                    con.is_read_by_customer = 1;
                    UserInfo.unread = UserInfo.unread>0 ? UserInfo.unread-1 : UserInfo.unread;
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
                    UserInfo.unread = UserInfo.unread>0 ? UserInfo.unread-1 : UserInfo.unread;
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
    }
})();