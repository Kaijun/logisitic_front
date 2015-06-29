(function() {
    'use strict';

    angular
        .module('home.services')
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
                debugger;
                return response.data;
            });
            return promise;
        }
    }
})();