(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('FinancialService', FinancialService);

    FinancialService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function FinancialService($http, AppConfig) {
        var service = {
            getRecords: getRecords
        };
        return service;

        ////////////////

        function getRecords() {
            var promise = $http.get(AppConfig.apiUrl + '/transaction-list/').then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();