(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('MsgService', MsgService);

    MsgService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function MsgService($http, AppConfig) {
        var service = {
            getConversations: getConversations,
            getConversationById: getConversationById,
            getNotifications: getNotifications,
            getNotificationsUnread: getNotificationsUnread,
            markNotificationAsRead: markNotificationAsRead,
            markConversationAsRead: markConversationAsRead,
            deleteNotification: deleteNotification,
            deleteConversation: deleteConversation,
            sendMessage: sendMessage,
            sendMessageInConv: sendMessageInConv,
        };
        return service;

        ////////////////

        function getConversations() {
            return $http.get(AppConfig.apiUrl+'/conversations/').then(function (response) {
                return response.data
            })
        }
        function getConversationById(id) {
            return $http.get(AppConfig.apiUrl+'/conversation/' + id).then(function (response) {
                return response.data
            })
        }
        function getNotifications() {
            return $http.get(AppConfig.apiUrl+'/notification-list/').then(function (response) {
                return response.data
            })
        }
        function getNotificationsUnread() {
            return $http.get(AppConfig.apiUrl+'/notification-list-unread/').then(function (response) {
                return response.data
            })
        }
        function markNotificationAsRead(id) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/mark-notification-as-read/' + id,
                method: 'PUT',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function markConversationAsRead(id) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/mark-conversation-as-read/' + id,
                method: 'PUT',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function deleteNotification(id) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/notification/' + id,
                method: 'DELETE',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function deleteConversation(id) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/conversation/' + id,
                method: 'DELETE',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function sendMessage(msg) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/message/',
                method: 'POST',
                data: msg,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function sendMessageInConv(convId, msg) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/message/' + convId,
                method: 'POST',
                data: msg,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();




