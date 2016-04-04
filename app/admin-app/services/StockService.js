(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http', '$httpParamSerializer', '$window'];

    /* @ngInject */
    function StockService(AppConfig, $http, $httpParamSerializer, $window) {
        var service = {
            getStocks: getStocks,
            queryStocks: queryStocks,
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
        function queryStocks(opt) {
            var promise = $http({
                url: AppConfig.apiUrl + '/stocks',
                method: 'GET',
                params: opt,
            }).then(function (response) {
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
             var href = AppConfig.apiUrl + '/batchdownload?packages=' + stocks;
             $window.open(href, "_blank");
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