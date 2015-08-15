(function() {
    'use strict';

    angular
        .module('home.services')
        .service('OrderService', OrderService);

    OrderService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function OrderService($http, AppConfig) {
        var service = {
            getPackages: getPackages,
            submitOrder: submitOrder,
            getOrderById: getOrderById,
            getOrders: getOrders,
        };

        return service;

        ////////////////

        function getPackages(statusId, warehouseId) {
            var promise = $http.get(AppConfig.apiUrl + '/packages?status=' + statusId + "&warehouse=" + warehouseId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getOrders() {
            var promise = $http.get(AppConfig.apiUrl + '/ship-order-list/').then(function (response) {
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

        function submitOrder(order) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/ship-order/',
                method: 'POST',
                data: order,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();