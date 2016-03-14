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
            getEanData: getEanData,
        };
        return service;

        ////////////////
        ////////////////
        function getStockStatusMapping (statusId) {
            statusId = Number(statusId) + 1;
                // 需要改statusId的类型
            var statusMapping = ['删除','未知','已登记','待入库','预报问题件','已入库','库存问题件','移库未确认','移库已确认','移库处理中','移库问题件','移库完成','申请发货','发货处理中','已发货']
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
        // 管理员入库清点, 或者整箱
        function enterStock(stockId, items) {            
            var promise = $http({
                url: AppConfig.apiUrl + '/stocks_enter/' + stockId,
                method: 'PUT',
                data: items,
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
                url: AppConfig.apiUrl + '/package/',
                method: 'POST',
                data: stock,
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
        function getEanData (code) {
            var promise = $http({
                url: 'http://eandata.com/feed/?v=3&keycode=503D836656E42A57&mode=json&find=' + code,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();