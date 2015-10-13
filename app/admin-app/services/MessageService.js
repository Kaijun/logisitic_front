(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('MessageService', MessageService);

    MessageService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function MessageService($http, AppConfig) {
        var service = {
            getBulkList: getBulkList,
            sendBulkMsg: sendBulkMsg,
            
        };
        return service;

        ////////////////

        function getBulkList() {
            var promise = $http({
                url: AppConfig.apiUrl + '/bulk-list',
                method: 'GET'
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function sendBulkMsg(msg) {
            var promise = $http({
                url: AppConfig.apiUrl + '/bulk',
                method: 'POST',
                data: msg,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();