(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('ScoreService', ScoreService);

    ScoreService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function ScoreService($http, AppConfig) {
        var service = {
            getScoreSetting: getScoreSetting,
            editScoreSetting: editScoreSetting,
            getLevelList: getLevelList,
            getLevel: getLevel,
            addLevel: addLevel,
            editLevel: editLevel,
            deleteLevel: deleteLevel,
        };
        return service;

        ////////////////

        function getScoreSetting() {
            var url = AppConfig.apiUrl + '/config/score-exp';
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function editScoreSetting(setting) {
            var url = AppConfig.apiUrl + '/config/score-exp';
            var promise = $http({
                url: url,
                method: 'PUT',
                data: setting,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getLevelList() {
            var url = AppConfig.apiUrl + '/user-level-list';
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getLevel(id) {
            var url = AppConfig.apiUrl + '/user-level/' + id;
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function addLevel(lvl) {
            var url = AppConfig.apiUrl + '/user-level/';
            var promise = $http({
                url: url,
                method: 'POST',
                data: lvl,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function editLevel(id, lvl) {
            var url = AppConfig.apiUrl + '/user-level/' + id;
            var promise = $http({
                url: url,
                method: 'PUT',
                data: lvl,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function deleteLevel(id) {
            var url = AppConfig.apiUrl + '/user-level/' + id;
            var promise = $http({
                url: url,
                method: 'DELETE',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();
