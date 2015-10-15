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
            deleteStock: deleteStock,
            submitStock: submitStock,
            getStockByTrackNr: getStockByTrackNr,
            batchDownload: batchDownload,
            batchUpload: batchUpload,
            submitBatch: submitBatch,

        };
        return service;

        ////////////////
        ////////////////
        function getStockStatusMapping (statusId) {
            statusId = Number(statusId) + 1;
                // 需要改statusId的类型
            var statusMapping = ['删除','未知','未预报','已预报','预报问题件','已入库','库存问题件','移库未确认','移库已确认','移库处理中','移库问题件','移库完成','申请发货','发货处理中','已发货']
            if(statusId < statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
        function getStocks(status) {
            var url = '';
            if(status){
                url = '?status=' + status;
            }
            var promise = $http.get(AppConfig.apiUrl + '/stocks' + url).then(function (response) {
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
            var promise = $http({
                url: AppConfig.apiUrl + '/stocks_enter/' + stockId,
                method: 'POST',
            }).then(function (response) {
                return response.data;
            });
            return promise;
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
        function deleteStock (stockId) {
            var promise = $http({
                url: AppConfig.apiUrl + '/stocks/' + stockId,
                method: 'DELETE',
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
        function batchDownload(stocks) {
                 var anchor = angular.element('<a/>');
                 anchor.attr({
                     href: AppConfig.apiUrl + '/batchdownload?packages=' + stocks,
                     target: '_blank',
                     download: '库存导出.xlsx'
                 })[0].click();
        }

        function batchUpload (excel) {
            var fd = new FormData();
            fd.append('upload', excel);
            var promise = $http.post(AppConfig.apiUrl + '/stocks_batch/', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response){
                return response.data;
            });
            return promise;
        }

        function submitBatch (stocks) {
            var promise = $http({
                url: AppConfig.apiUrl + '/batch-saving/',
                method: 'PUT',
                data: stocks,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();