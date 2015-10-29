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
            searchOrderByRef: searchOrderByRef,
            editOrder: editOrder,
            deleteOrder: deleteOrder,
            batchDownload: batchDownload,
        };

        return service;

        ////////////////

        function getOrders(status) {
            var url = '';
            if(status){
                url = '?order_status=' + status;
            }
            var promise = $http.get(AppConfig.apiUrl + '/ship-order'+url).then(function (response) {
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
        function searchOrderByRef(orderId) {
            var promise = $http.get(AppConfig.apiUrl + '/search-by-ref-code/' + orderId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        // function getOrderById(orderId) {
        //     var promise = $http.get(AppConfig.apiUrl + '/ship-order/' + orderId).then(function (response) {
        //         return response.data;
        //     });
        //     return promise;
        // }
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
             var anchor = angular.element('<a/>');
             anchor.attr({
                 href: AppConfig.apiUrl + '/batchdownload?shiporders=' + orders,
                 target: '_blank',
                 download: '订单导出.xlsx'
             })[0].click();

        }

    }
})();