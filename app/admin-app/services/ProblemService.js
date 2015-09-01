(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('ProblemService', ProblemService);

    ProblemService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function ProblemService($http, AppConfig) {

        return {
            newProblemPkg: newProblemPkg,
            getProblemPkgs: getProblemPkgs,
        };

        ////////////////

        function getProblemPkgs() {
            var promise = $http({
                url: AppConfig.apiUrl + '/hasproblem/',
                method: 'GET',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }

        function newProblemPkg(pkg) {
            var promise = $http({
                url: AppConfig.apiUrl + '/hasproblem/',
                method: 'PUT',
                data: pkg,
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();