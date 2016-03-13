(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('PackageClaim', PackageClaim);

    PackageClaim.$inject = ['$scope', '$timeout', 'StockService', '$state'];

    /* @ngInject */
    function PackageClaim($scope, $timeout, StockService, $state) {
        $scope.claimRef = '';
        $scope.initStep = false;
        $scope.nextStep = false;
        $scope.failedClaimRef = '';
        $scope.packageID = null;
        $scope.claim = {
          "package_id": null,
          "sender_info": null,
          "receiver_info": null,
          "items_info": null
        }

        $scope.searchClaim = function() {
          $scope.claim = {
            "package_id": null,
            "sender_info": null,
            "receiver_info": null,
            "items_info": null
          }
          if($scope.claimRef.length===0) return;
          StockService.searchPackageClaim($scope.claimRef).then(function(data) {
            $scope.initStep = true;
            if(data.success===true){
              $scope.nextStep = true;
              $scope.claim.package_id = data.package_id;
            }
          }, function() {
            $scope.initStep = true;

              $scope.nextStep = false;
            $scope.failedClaimRef = $scope.claimRef;
          })
        }

        $scope.confirm = function() {
          if($scope.claim.package_id && $scope.claim.sender_info && $scope.claim.receiver_info){
            StockService.submitPackageClaim($scope.claim).then(function(data) {
              if(data.success===true){
                swal('提交包裹认领成功', '', 'success');
                $state.go('stockList', {}, {reload: true});
              }
            })
          }
        }
    }
})();