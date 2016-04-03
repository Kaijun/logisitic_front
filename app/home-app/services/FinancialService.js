(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('FinancialService', FinancialService);

    FinancialService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function FinancialService($http, AppConfig) {
        var service = {
            getRecords: getRecords,
            refill: refill,
        };
        return service;

        ////////////////

        function getRecords() {
            var promise = $http.get(AppConfig.apiUrl + '/transaction-list/').then(function (response) {
                return response.data;
            });
            return promise;
        }
        function refill(data) {
            var promise = $http({
                url: '/pay/alipay',
                method: 'POST',
                data: data,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();