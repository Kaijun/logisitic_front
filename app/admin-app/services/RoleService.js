(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('RoleService', RoleService);

    RoleService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function RoleService($http, AppConfig) {
        return {
            getRoles: getRoles,
            submitRole: submitRole,
            deleteRole: deleteRole,
            getRole: getRole,
        }

        ////////////////

        function getRoles() {
            var promise = $http({
                url: AppConfig.apiUrl + '/role-list/',
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getRole(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/role/' + id,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function deleteRole(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/role/' + id,
                method: 'DELETE',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function submitRole(role) {
            var promise = $http({
                url: AppConfig.apiUrl + '/role/',
                method: 'PUT',
                data: role,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();