(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('TicketService', TicketService);

    TicketService.$inject = ['AppConfig', '$http', '$cacheFactory'];

    /* @ngInject */
    function TicketService(AppConfig, $http, $cacheFactory) {

        var ticketCache = $cacheFactory('ticketCache');

        var service = {
            getTicketList: getTicketList,
            assignTicket: assignTicket,
            getTicket: getTicket,
            getBackendUserList: getBackendUserList,
            sendMessageInConv: sendMessageInConv,
        };
        return service;

        ////////////////
        function getTicketList () {
            var promise = $http({
                url: AppConfig.apiUrl + '/ticket-list/',
                method: 'GET',
            }).then(function (res) {
                return res.data;
            });
            return promise
        }

        function assignTicket (ticketId, handlerId) {
            var promise = $http({
                url: AppConfig.apiUrl + '/ticket/assign/' + ticketId + '/' + handlerId,
                method: 'PUT',
            }).then(function (res) {
                return res.data;
            });
            return promise
        }
        function getTicket (ticketId) {
            var promise = $http({
                url: AppConfig.apiUrl + '/ticket/' + ticketId,
                method: 'GET',
            }).then(function (res) {
                return res.data;
            });
            return promise
        }
        function getBackendUserList () {
            if(ticketCache.get('ticketCache')){
                return ticketCache.get('backendUserList');
            }

            var promise = $http({
                url: AppConfig.apiUrl + '/get-backend-user-list/',
                method: 'GET',
            }).then(function (res) {
                return res.data;
            });

            ticketCache.put('backendUserList', promise)
            return promise;

        }
        function sendMessageInConv(convId, msg) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/message/' + convId,
                method: 'POST',
                data: msg,
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();