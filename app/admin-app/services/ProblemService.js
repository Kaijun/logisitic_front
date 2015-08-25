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
        };

        ////////////////

        function newProblemPkg(pkg) {
            var promise = $http({
                url: AppConfig.apiUrl + '/hasproblem/',
                method: 'POST',
                data: pkg,
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();