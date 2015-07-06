(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http'];

    /* @ngInject */
    function StockService(AppConfig, $http, $httpParamSerializer) {
        var service = {
            editingStock: null,
            editingStockId: null,
            getStock: getStock,
            getStocks: getStocks,
            submitStock: submitStock,
            editStock: editStock,
        };
        return service;

        ////////////////

        function getStock(stockId) {
            var promise = $http.get(AppConfig.apiUrl + '/stocks/' + stockId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getStocks() {
            var promise = $http.get(AppConfig.apiUrl + '/stocks/').then(function (response) {
                return response.data;
            });
            return promise;
        }
        function submitStock(stock) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/stocks/',
                method: 'POST',
                data: stock,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function editStock(stockId, stock) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/stocks/' + stockId,
                method: 'PUT',
                data: stock,
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