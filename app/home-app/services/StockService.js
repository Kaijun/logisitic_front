(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http', '$cacheFactory', '$q'];

    /* @ngInject */
    function StockService(AppConfig, $http, $cacheFactory, $q) {

        var stockInfoCache = $cacheFactory('stockInfo');

        var service = {
            editingStock: null,
            editingStockId: null,
            getStockStatusMapping: getStockStatusMapping,
            getWarehouses: getWarehouses,
            getLogisticPaths: getLogisticPaths,
            getStock: getStock,
            getStocks: getStocks,
            submitStock: submitStock,
            editStock: editStock,
        };
        return service;

        ////////////////
        function getStockStatusMapping (statusId) {
            var statusMapping = ['未知','未预报','已预报','预报问题件','已入库','库存问题件','申请移库','移库处理中','移库问题件','申请发货','发货处理中','已发货']
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }

        function getWarehouses() {
            if(stockInfoCache.get('warehouses')){
                return stockInfoCache.get('warehouses');
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/warehouses').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('warehouses', promise)
            return promise;
        }
        function getLogisticPaths() {
            if(stockInfoCache.get('logisticPaths')){
                return stockInfoCache.get('logisticPaths');
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/logistic-paths').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('logisticPaths', promise)
            return promise;
        }

        function getStock(stockId) {
            var promise = $http.get(AppConfig.apiUrl + '/stocks/' + stockId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getStocks() {
            var promise = $http.get(AppConfig.apiUrl + '/stocks/').then(function (response) {
                var stocks = response.data;
                // stocks.map(function (item) {
                //     item.timestamp = (new Date(item.timestamp.date)).toISOString().substring(0, 10);;
                //     return item;
                // })
                return stocks;
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