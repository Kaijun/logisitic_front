(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('RoleManage', RoleManage);

    RoleManage.$inject = ['$scope', 'RoleService', '$timeout', '$state', '$window'];

    /* @ngInject */
    function RoleManage($scope, RoleService, $timeout, $state, $window) {
        var roleObj = {
            accountancy: '0',
            is_adminstrator: '0',
            is_backend: '0',
            is_vip: '0',
            role_name: '',
            ship_manage: '0',
            stock_manage: '0',
        }
        $scope.role = null;
        $scope.addRole = addRole;
        $scope.goBack = goBack;

        activate();

        ////////////////

        function activate() {
            $timeout(function () {
                $scope.role = angular.copy(roleObj);
            })

        }
        function addRole () {
            RoleService.submitRole($scope.role).then(function () {
                $state.go('roleList', {}, {reload: true});
            })
        }
        function goBack () {
            $window.history.back();
        }
    }
})();