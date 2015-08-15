(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('LogisticService', LogisticService);

    LogisticService.$inject = ['$http', 'AppConfig', '$httpParamSerializer'];

    /* @ngInject */
    function LogisticService($http, AppConfig, $httpParamSerializer) {
        var service = {
            submitLogistic: submitLogistic
        };
        return service;

        ////////////////

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
    }
})();