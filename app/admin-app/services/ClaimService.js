(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('ClaimService', ClaimService);

    ClaimService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function ClaimService($http, AppConfig) {
        var service = {
            getClaimList: getClaimList,
            assignClaim: assignClaim,
            getClaimDetail: getClaimDetail,
        };
        return service;

        ////////////////

        function getClaimList() {
            var url = AppConfig.apiUrl + '/claim-list';
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function assignClaim(packageId, userId) {
            var url = AppConfig.apiUrl + '/claim/assign/' + packageId + '/' + userId + '/';
            var promise = $http({
                url: url,
                method: 'PUT',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getClaimDetail(id) {
            var url = AppConfig.apiUrl + '/claim/' + id;
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();