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
            solveProblemPkg: solveProblemPkg,
            getProblemPkgs: getProblemPkgs,
            getProblemPkg: getProblemPkg,
        };

        ////////////////

        // 0-库存 1-订单 2-移库
        function getProblemPkgs(type) {
            var promise = $http({
                url: AppConfig.apiUrl + '/hasproblem?type='+type,
                method: 'GET',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function getProblemPkg(type, id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/hasproblem?type='+type+'&id='+id,
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

        function solveProblemPkg(pkg) {
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