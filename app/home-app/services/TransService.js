(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('TransService', TransService);

    TransService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function TransService($http, AppConfig) {
        var service = {
            getTrans: getTrans,
            getTranss: getTranss,
            submitTrans: submitTrans,
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
            var promise = $http.get(AppConfig.apiUrl + '/trans-order-list/').then(function (response) {
                return response.data;
            });
            return promise;
        }

        function submitTrans(trans) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order/',
                method: 'POST',
                data: trans,
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