(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http'];

    /* @ngInject */
    function StockService(AppConfig, $http) {

        var service = {
            getStock: getStock,
            getStocks: getStocks,
            getCurrentStocks: getCurrentStocks,
            // submitStock: submitStock,
            editStock: editStock,
            submitPackageClaim: submitPackageClaim,
            searchPackageClaim: searchPackageClaim,
            // deleteStock: deleteStock,
        };
        return service;

        ////////////////
        

        function getStock(stockId) {
            var promise = $http.get(AppConfig.apiUrl + '/package/' + stockId).then(function (response) {
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
        function getCurrentStocks() {
            var promise = getStocks().then(function (data) {
                var data = data.filter(function (item) {
                    var status = parseInt(item.status);
                    return status>0 && status<=4;
                }).slice(0,10);
                return data;
            });
            return promise;
        }
        // function submitStock(stock) {
        //     var promise =  $http({
        //         url: AppConfig.apiUrl + '/stocks/',
        //         method: 'POST',
        //         data: stock,
        //         headers: {
        //           'Content-Type': 'application/x-www-form-urlencoded'
        //         }
        //     }).then(function(response){
        //         return response.data;
        //     });
        //     return promise;
        // }
        function editStock(stockId, stock) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/package/' + stockId,
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
        function submitPackageClaim(claim) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/claim/',
                method: 'POST',
                data: claim,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function searchPackageClaim(refCode) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/claim-search/' + refCode,
                method: 'GET',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        // function deleteStock(stockId) {
        //     var promise =  $http({
        //         url: AppConfig.apiUrl + '/stocks/' + stockId,
        //         method: 'DELETE',
        //         headers: {
        //           'Content-Type': 'application/x-www-form-urlencoded'
        //         }
        //     }).then(function(response){
        //         return response.data;
        //     });
        //     return promise;
        // }

    }
})();