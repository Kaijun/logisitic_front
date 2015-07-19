(function() {
    'use strict';

    angular
        .module('admin.services')
        .service('OrderService', OrderService);

    OrderService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function OrderService($http, AppConfig) {
        var service = {
            getOrders: getOrders,
            getOrderById: getOrderById,
        };

        return service;

        ////////////////

        function getOrders() {
            var promise = $http.get(AppConfig.apiUrl + '/ship-order/').then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getOrderById(orderId) {
            var promise = $http.get(AppConfig.apiUrl + '/ship-order/' + orderId).then(function (response) {
                return response.data;
            });
            return promise;
        }

    }
})();