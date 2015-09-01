(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('ExtraSrvService', ExtraSrvService);

    ExtraSrvService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function ExtraSrvService($http, AppConfig) {
        var service = {
            getExtraSrvs: getExtraSrvs,
            submitExtraSrv: submitExtraSrv,
            deleteExtraSrv: deleteExtraSrv,
        };
        return service;

        ////////////////

        function submitExtraSrv(extraSrv) {
            var promise = $http({
                url: AppConfig.apiUrl + '/extra-service/',
                method: 'POST',
                data: extraSrv,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        
        function getExtraSrvs() {
            var promise = $http({
                url: AppConfig.apiUrl + '/extra-service/',
                method: 'GET'
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }

        function deleteExtraSrv(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/extra-service/' +id,
                method: 'DELETE'
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();