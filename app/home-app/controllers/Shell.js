(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['StockService', '$scope', '$rootScope', 'UserInfo', '$timeout', '$state'];

    /* @ngInject */
    function Shell(StockService, $scope, $rootScope, UserInfo, $timeout, $state) {

        $scope.isLoadingCompleted = false;
        $scope.userInfo = null;
        var loadingFlag = false;

        $rootScope.$state = $state;

        activate();

        ////////////////

        function activate() {

            if(UserInfo){
                $timeout(function() {
                    $scope.userInfo = UserInfo;
                })
            }

            // $rootScope.$on('$stateChangeSuccess', function(){
            //     $scope.isLoadingCompleted = false;
            //     var loadingFlag = false;
            // });

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