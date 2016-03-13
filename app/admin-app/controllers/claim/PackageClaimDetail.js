(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PackageClaimDetail', PackageClaimDetail);

    PackageClaimDetail.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'ClaimService', 'InfoService'];

    /* @ngInject */
    function PackageClaimDetail($scope, $timeout, $state, $stateParams, ClaimService, InfoService) {

        if(!$stateParams.claimId) return;

        $scope.claimToAssign = {data: null};

        $scope.claim = null;
        InfoService.getWarehouses().then(function (data) {
            $scope.warehouses = data;
        }).then(function() {
            ClaimService.getClaimDetail($stateParams.claimId).then(function(data) {
                data.warehouseName = $scope.warehouses.filter(function(item){
                    return parseInt(item.id)===parseInt(data.warehouse_id)
                })[0].name;
                data.created_at = data.created_at.substring(0, 10);
                data.statusStr = InfoService.getStockStatusMapping(data.status);
                if(data.claims.length>0) $scope.claimToAssign.data = data.claims[0];

                $timeout(function() {
                    $scope.claim = data;
                    console.log($scope.claim.claims)
                })
            })
        });

        $scope.assign = function() {
            if($scope.claimToAssign.data){
                ClaimService.assignClaim($scope.claimToAssign.data.package_id, $scope.claimToAssign.data.user_id).then(function(data) {
                    if(data.success===true){
                        swal('认领成功', '', 'success');
                        $state.go('packageClaimList', {}, {reload: true});
                    }
                })
            }
        }
    }
})();