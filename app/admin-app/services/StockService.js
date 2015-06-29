(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('StockService', StockService);

    StockService.$inject = ['AppConfig', '$http'];

    /* @ngInject */
    function StockService(AppConfig, $http) {
        var service = {
            getStocks: getStocks
        };
        return service;

        ////////////////

        function getStocks() {
            var promise = $http.get(AppConfig.apiUrl + '/stocks').then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();