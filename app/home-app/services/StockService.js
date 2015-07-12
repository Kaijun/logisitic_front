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
            getStockStatusMapping: getStockStatusMapping,
            getWarehouses: getWarehouses,
            getLogisticPaths: getLogisticPaths,
            getExtraServices: getExtraServices,
            getStock: getStock,
            getStocks: getStocks,
            submitStock: submitStock,
            editStock: editStock,
            uploadImage: uploadImage,
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
        function getLogisticPaths(type) {
            if(stockInfoCache.get('logisticPaths')){
                return stockInfoCache.get('logisticPaths').then(function(data){
                    var data = data.filter(function(value){
                        return value.type === type;
                    });
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/logistic-paths').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('logisticPaths', promise);

            promise = promise.then(function(data) {
                var data = data.filter(function(value){
                    return value.type === type;
                });
                return data;
            });
            return promise;
        }
        function getExtraServices(type, userGroup) {
            if(stockInfoCache.get('extraServices')){
                return stockInfoCache.get('extraServices').then(function(data){
                    var data = data.filter(function(value){
                        return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                    });
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/extra-services').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('extraServices', promise);

            promise = promise.then(function(data) {
                var data = data.filter(function(value){
                    return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                });
                return data;
            });
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

        function uploadImage (image) {
            var fd = new FormData();
            fd.append('image', image);
            var promise = $http.post(AppConfig.apiUrl + '/image/', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();