(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http', '$httpParamSerializer'];

    /* @ngInject */
    function StockService(AppConfig, $http, $httpParamSerializer) {
        var service = {
            getStockStatusMapping: getStockStatusMapping,
            getStocks: getStocks,
            getStock: getStock,
            enterStock: enterStock,
            submitStock: submitStock,
            getStockByTrackNr: getStockByTrackNr,

        };
        return service;

        ////////////////
        ////////////////
        function getStockStatusMapping (statusId) {
            var statusMapping = ['未知','未预报','已预报','预报问题件','已入库','库存问题件','申请移库','移库处理中','移库问题件','申请发货','发货处理中','已发货']
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
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