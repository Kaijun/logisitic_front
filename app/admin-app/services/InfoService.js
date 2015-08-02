(function() {
    'use strict';

    angular
        .module('admin.services')
        .service('InfoService', InfoService);

    InfoService.$inject = ['AppConfig', '$http', '$cacheFactory', '$q'];

    /* @ngInject */
    function InfoService(AppConfig, $http, $cacheFactory, $q) {
        var stockInfoCache = $cacheFactory('stockInfo');

        var service = {
            getStockStatusMapping: getStockStatusMapping,
            getOrderStatusMapping: getOrderStatusMapping,
            getWarehouses: getWarehouses,
            getWarehouseById: getWarehouseById,
            getLogisticPaths: getLogisticPaths,
            getLogisticPathById: getLogisticPathById,
            getExtraServices: getExtraServices,
        };
        return service;

        function getStockStatusMapping (statusId) {
            statusId = statusId + 1;
            var statusMapping = ['删除','未知','未预报','已预报','预报问题件','已入库','库存问题件','（对方）未确认','（对方）已确认','移库处理中','移库问题件','移库完成','申请发货','发货处理中','已发货']
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
        function getOrderStatusMapping (statusId) {
            statusId = statusId + 1;
            var statusMapping = ['删除','未知','发货处理中','待付款','已付款','已发货','订单问题件'];
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
        function getWarehouses() {
            if(stockInfoCache.get('warehouses')){
                return stockInfoCache.get('warehouses');
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/warehouses').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('warehouses', promise)
            return promise;
        }

        function getWarehouseById (id) {
           return getWarehouses().then(function(whs) {
                var wh = whs.filter(function (item) {
                    return parseInt(item.id) === parseInt(id);
                });
                return angular.isArray(wh)&&wh.length>0 ? wh[0] : null;
           });
        }
        function getLogisticPaths(type) {
            if(stockInfoCache.get('logisticPaths')){
                return stockInfoCache.get('logisticPaths').then(function(data){
                    var data = data.filter(function(value){
                        return value.type === type;
                    });
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/logistic-paths').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('logisticPaths', promise);

            promise = promise.then(function(data) {
                var data = data.filter(function(value){
                    return value.type === type;
                });
                return data;
            });
            return promise;
        }

        function getLogisticPathById (id, type) {
           return getLogisticPaths(type).then(function(lps) {
                var lp = lps.filter(function (item) {
                    return parseInt(item.id) === parseInt(id);
                });
                return angular.isArray(lp)&&lp.length>0 ? lp[0] : null;
           });
        }
        function getExtraServices(type, userGroup) {
            if(stockInfoCache.get('extraServices')){
                return stockInfoCache.get('extraServices').then(function(data){
                    var data = data.filter(function(value){
                        return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                    });
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/extra-services').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('extraServices', promise);

            promise = promise.then(function(data) {
                var data = data.filter(function(value){
                    return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                });
                return data;
            });
            return promise;
        }

    }
})();