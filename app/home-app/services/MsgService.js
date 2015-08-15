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




