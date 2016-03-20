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
    }
})();
