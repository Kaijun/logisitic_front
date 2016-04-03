(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function UserService($http, AppConfig) {
        return{

            getUsers: getUsers,
            getUser: getUser,
            getUserByStockNumber: getUserByStockNumber,
            editUser: editUser,
            deleteUser: deleteUser,
            resetPassword: resetPassword,
        }

        ////////////////

        function getUsers() {
            var promise = $http({
                url: AppConfig.apiUrl + '/user',
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getUser(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/user/'+id,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getUserByStockNumber(sn) {
            var promise = $http({
                url: AppConfig.apiUrl + '/get-user-by-stock-number/'+sn,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function editUser(id, user) {
            var promise = $http({
                url: AppConfig.apiUrl + '/user/'+id,
                method: 'PUT',
                data: user,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function deleteUser(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/user/'+id,
                method: 'DELETE',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function resetPassword(email) {
            var promise = $http({
                url: '/password/',
                method: 'POST',
                data: 'email='+email,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();