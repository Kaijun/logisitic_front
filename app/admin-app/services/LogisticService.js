(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('LogisticService', LogisticService);

    LogisticService.$inject = ['$http', 'AppConfig', '$httpParamSerializer'];

    /* @ngInject */
    function LogisticService($http, AppConfig, $httpParamSerializer) {
        var service = {
            submitLogistic: submitLogistic,
            getLogistics: getLogistics,
            getLogisticById: getLogisticById,
            deleteLogistic: deleteLogistic,
            editLogistic: editLogistic,

            getLogisticTypes,
            deleteLogisticType,
            submitLogisticType,

        };
        return service;

        ////////////////

        function getLogistics() {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistic/',
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getLogisticById(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistic/' + id,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function deleteLogistic(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistic/' + id,
                method: 'DELETE',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function submitLogistic(logisticPath) {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistic/',
                method: 'POST',
                data: logisticPath,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function editLogistic(id, logisticPath) {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistic/' + id,
                method: 'PUT',
                data: logisticPath,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }


        function getLogisticTypes() {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistict-types/',
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function deleteLogisticType(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistict-types/' + id,
                method: 'DELETE',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function submitLogisticType(logisticPath) {
            var promise = $http({
                url: AppConfig.apiUrl + '/logistict-types/',
                method: 'PUT',
                data: logisticPath,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();