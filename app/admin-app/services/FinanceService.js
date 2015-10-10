(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('FinanceService', FinanceService);

    FinanceService.$inject = ['$http', 'AppConfig', '$httpParamSerializer'];

    /* @ngInject */
    function FinanceService($http, AppConfig, $httpParamSerializer) {
        var service = {
            chargeAmount: chargeAmount,
            getAmountByEmail: getAmountByEmail,
            getAmountByStockNum: getAmountByStockNum,
            getRecords: getRecords,
        };
        return service;

        ////////////////

        function chargeAmount(chargeObj) {
            var promise = $http({
                url: AppConfig.apiUrl + '/finance/',
                method: 'PUT',
                data: chargeObj,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }

        function getAmountByEmail (email) {
            return $http.get(AppConfig.apiUrl + '/finance/info?email=' + email).then(function (response) {
                return response.data;
            })
        }
        function getAmountByStockNum (stocknum) {
            return $http.get(AppConfig.apiUrl + '/finance/info?stock_number=' + stocknum).then(function (response) {
                return response.data;
            })
        }
        function getRecords (page) {
            var page = page?('?page='+page):'';
            var url = '/transaction-list' + page;
            return $http.get(AppConfig.apiUrl + url).then(function (response) {
                return response.data;
            })
        }
    }
})();