(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http', '$httpParamSerializer'];

    /* @ngInject */
    function StockService(AppConfig, $http, $httpParamSerializer) {
        var service = {
            getStocks: getStocks,
            getStock: getStock,
            enterStock: enterStock,

        };
        return service;

        ////////////////

        function getStocks() {
            var promise = $http.get(AppConfig.apiUrl + '/stocks/').then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getStock(stockId) {
            var promise = $http.get(AppConfig.apiUrl + '/stocks/' + stockId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getStockByTrackNr(tn) {
            var promise = $http.get(AppConfig.apiUrl + '/stocks?tracknumber=' + tn).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function enterStock(stockId) {
            return putStock(stockId, {status: 4})
        }

        function putStock (stockId, stock) {
            var promise = $http({
                url: AppConfig.apiUrl + '/stocks/' + stockId,
                method: 'PUT',
                data: $httpParamSerializer(stock),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }

        function submitStock (stock) {
            var promise = $http({
                url: AppConfig.apiUrl + '/stocks/',
                method: 'POST',
                data: $httpParamSerializer(stock),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();