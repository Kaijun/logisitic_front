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

            

            
        // Date object compatiblity
        if (!Date.prototype.toISOString) {
          (function() {

            function pad(number) {
              if (number < 10) {
                return '0' + number;
              }
              return number;
            }

            Date.prototype.toISOString = function() {
              return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
            };

          }());
        }
     
        }
    }
})();