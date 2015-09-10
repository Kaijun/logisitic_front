(function() {
    'use strict';

    angular
        .module('home.services')
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
            getTypes: getTypes,
            getTypeById: getTypeById,
            uploadImage: uploadImage,
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
            var statusMapping = ['删除','未知','发货处理中','待付款','已付款','待发货','已发货','订单问题件'];
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
        // 0=all, 1=入库 2=出库 3=移库
        function getLogisticPaths(type) {
            if(stockInfoCache.get('logisticPaths')){
                return stockInfoCache.get('logisticPaths').then(function(data){
                    if(angular.isArray(data)){
                        if(parseInt(type)===0){
                            return data;
                        }
                        else{
                            var data = data.filter(function(value){
                                return parseInt(value.type) === type;
                            });
                        }
                    }
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/logistic-paths').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('logisticPaths', promise);

            promise = promise.then(function(data) {
                if(angular.isArray(data)){
                    if(parseInt(type)===0){
                        return data;
                    }
                    else{
                        var data = data.filter(function(value){
                            return parseInt(value.type) === type;
                        });
                    }
                }
                return data;
            });
            return promise;
        }

        // type: 0=all, 1=入库，2=出库, 3=移库
        function getLogisticPathById (id, type) {
           return getLogisticPaths(type).then(function(lps) {
                if(angular.isArray(lps)){
                    var lp = lps.filter(function (item) {
                        return parseInt(item.id) === parseInt(id);
                    });
                }
                return angular.isArray(lp)&&lp.length>0 ? lp[0] : null;
           });
        }

        // type: 1=入库, 2=出库, 3=入库+出库
        // user_group: 0=all, 1=vip only
        function getExtraServices(type, userGroup) {
            if(stockInfoCache.get('extraServices')){
                return stockInfoCache.get('extraServices').then(function(data){
                    if(angular.isArray(data)){
                        var data = data.filter(function(value){
                            return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                        });
                    }
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/extra-services').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('extraServices', promise);

            promise = promise.then(function(data) {
                if(angular.isArray(data)){
                    data = data.filter(function(value){
                        return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                    });
                }
                return data;
            });
            return promise;
        }

        function getTypes () {
            if(stockInfoCache.get('types')){
                return stockInfoCache.get('types');
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/logistic-types').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('types', promise);
            return promise;
        }

        function getTypeById (id) {
            return getTypes().then(function (data) {
                var t = data.filter(function (item) {
                    return parseInt(item.id) === parseInt(id);
                });
                return angular.isArray(t)&&t.length>0 ? t[0] : null;
            })
        }

        function uploadImage (image) {
            var fd = new FormData();
            fd.append('image', image);
            var promise = $http.post(AppConfig.apiUrl + '/image/', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();