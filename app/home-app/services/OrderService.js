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
            deleteOrder: deleteOrder,
            editOrder: editOrder,
            getOrders: getOrders,
            getCurrentOrders: getCurrentOrders,
            payOrder: payOrder,
            getEstimatePrice: getEstimatePrice,
            
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
        function getCurrentOrders() {
            var promise = getOrders().then(function (data) {
                var data = data.slice(0,10);
                return data;
            });
            return promise;
        }  
        function getOrderById(orderId) {
            var promise = $http.get(AppConfig.apiUrl + '/ship-order/' + orderId).then(function (response) {
                return response.data;
            });
            return promise;
        }  
        function deleteOrder(orderId) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/ship-order/' + orderId,
                method: 'DELETE',
            }).then(function(response){
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

        function payOrder (orderId) {
            var promise = $http({
                url: AppConfig.apiUrl + '/ship-order-pay/' + orderId,                
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }

        function getEstimatePrice (data) {
            var promise = $http({
                url: AppConfig.apiUrl + '/estimate-price/',
                method: 'POST',
                data: data
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();