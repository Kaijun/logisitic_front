(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['StockService', '$scope', '$rootScope', 'UserInfo', '$timeout'];

    /* @ngInject */
    function Shell(StockService, $scope, $rootScope, UserInfo, $timeout) {

        $scope.isLoadingCompleted = false;
        $scope.userInfo = null;
        var loadingFlag = false;

        activate();

        ////////////////

        function activate() {

            if(UserInfo){
                $timeout(function() {
                    $scope.userInfo = UserInfo;
                })
            }

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