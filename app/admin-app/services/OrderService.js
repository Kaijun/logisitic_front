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
            deleteOrder: deleteOrder,
            batchDownload: batchDownload,
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


        function deleteOrder(orderId) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/ship-order/' + orderId,
                method: 'DELETE',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }


        function batchDownload(orders) {
            var orders = orders.join(',')
            var promise = $http.get(AppConfig.apiUrl + '/batchdownload?shiporders=' + orders).success(function(data, status, headers, config) {
                 var anchor = angular.element('<a/>');
                 anchor.attr({
                     href: 'data:attachment/xlsx;charset=utf-8,' + encodeURI(data),
                     target: '_blank',
                     download: '库存导出.xlsx'
                 })[0].click();

              }).
              error(function(data, status, headers, config) {
                // if there's an error you should see it here
            });
            return promise;
        }

    }
})();