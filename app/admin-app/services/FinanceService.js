(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('FinanceService', FinanceService);

    FinanceService.$inject = ['$http', 'AppConfig', '$httpParamSerializer', '$window'];

    /* @ngInject */
    function FinanceService($http, AppConfig, $httpParamSerializer, $window) {
        var service = {
            chargeAmount: chargeAmount,
            getAmountByEmail: getAmountByEmail,
            getAmountByStockNum: getAmountByStockNum,
            getRecords: getRecords,
            queryRecords: queryRecords,
            exportRecords: exportRecords,
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
        function queryRecords(opt) {
            var promise = $http({
                url: AppConfig.apiUrl + '/transaction-list',
                method: 'GET',
                params: opt,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function exportRecords(array) {
             var href = AppConfig.apiUrl + '/transaction-list-export?transactions=' + array.join(',')
             $window.open(href, "_blank")
        }
    }
})();