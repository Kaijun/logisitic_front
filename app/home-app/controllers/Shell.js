(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['StockService', '$scope', '$rootScope'];

    /* @ngInject */
    function Shell(StockService, $scope, $rootScope) {

        $scope.isLoadingCompleted = false;
        var loadingFlag = false;

        activate();

        ////////////////

        function activate() {
            $rootScope.$on('cfpLoadingBar:started', function () {
                loadingFlag = true;
                $scope.isLoadingCompleted = false;
            });
            $rootScope.$on('cfpLoadingBar:completed', function () {
                if(loadingFlag){
                    $scope.isLoadingCompleted = true;
                    loadingFlag = false;
                }
            });
        }
    }
})();