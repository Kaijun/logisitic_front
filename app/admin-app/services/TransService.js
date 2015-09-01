(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('TransService', TransService);

    TransService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function TransService($http, AppConfig) {
        var service = {
            getTrans: getTrans,
            getTranss: getTranss,
            editTrans: editTrans,
            deleteTrans: deleteTrans,
        };
        return service;

        ////////////////

        function getTrans(transId) {
            var promise = $http.get(AppConfig.apiUrl + '/trans-order/' + transId).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getTranss() {
            var promise = $http.get(AppConfig.apiUrl + '/trans-order/').then(function (response) {
                return response.data;
            });
            return promise;
        }

        function editTrans(transId, trans) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order/' + transId,
                method: 'PUT',
                data: trans,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function deleteTrans(transId) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order/' + transId,
                method: 'DELETE',
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