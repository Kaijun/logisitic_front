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
            editOrder: editOrder,
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
        function getOrderById(orderId) {
            var promise = $http.get(AppConfig.apiUrl + '/ship-order/' + orderId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function editOrder(orderId, order) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/ship-order/' + orderId,
                method: 'PUT',
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