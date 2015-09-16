(function() {
    'use strict';

    angular
        .module('home.services')
        .service('VorkasseService', VorkasseService);

    VorkasseService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function VorkasseService($http, AppConfig) {
 
        var service = {
            getVorkasse: getVorkasse,
            getVorkasses: getVorkasses,
            submitVorkasse: submitVorkasse,
            editVorkasse: editVorkasse,
            deleteVorkasse: deleteVorkasse,
        };
        return service;

        ////////////////
        

        function getVorkasse(id) {
            var promise = $http.get(AppConfig.apiUrl + '/purchase-agent/' + id).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getVorkasses() {
            var promise = $http.get(AppConfig.apiUrl + '/purchase-agent-list/').then(function (response) {
                var stocks = response.data;
                return stocks;
            });
            return promise;
        }
        function submitVorkasse(vk) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/purchase-agent/',
                method: 'POST',
                data: vk,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function editVorkasse(id, vk) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/purchase-agent/' + id,
                method: 'PUT',
                data: vk,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function deleteVorkasse(id) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/purchase-agent/' + id,
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