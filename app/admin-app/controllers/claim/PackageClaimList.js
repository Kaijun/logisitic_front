(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PackageClaimList', PackageClaimList);

    PackageClaimList.$inject = ['$scope', '$timeout', '$state', 'ClaimService'];

    /* @ngInject */
    function PackageClaimList($scope, $timeout, $state, ClaimService) {

      $scope.claims = [];

      ClaimService.getClaimList().then(function(data) {
        
        $scope.claims = data;
        $scope.claims.map(function (item) {
            item.claimNum = item.claims.length;
            item.dateStr = item.updated_at.substring(0, 10);
        })
      })
    }
})();