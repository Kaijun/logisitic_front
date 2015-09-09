(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('UserManage', UserManage);

    UserManage.$inject = ['$scope', 'UserService', 'RoleService', '$timeout', '$stateParams', '$state', '$window'];

    /* @ngInject */
    function UserManage($scope, UserService, RoleService, $timeout, $stateParams, $state, $window) {

        $scope.user = null;
        $scope.roles = [];
        $scope.saveEdit = saveEdit;
        $scope.deleteUser = deleteUser;
        $scope.goBack = goBack;

        activate();

        function activate() {
            if($stateParams.userId){
                RoleService.getRoles().then(function (data) {
                    $timeout(function () {
                        $scope.roles = data;


                        UserService.getUser($stateParams.userId).then(function (data) {
                            $timeout(function () {
                                $scope.user = data;
                            })
                        }, function () {
                            $state.go('userList', {}, {reload: true})
                        })


                    })
                })
            }
        }
        function saveEdit () {
            UserService.editUser($stateParams.userId, $scope.user).then(function (data) {
                $state.go('userManage', {userId: $stateParams.userId}, {reload: true})
            })
        }

        function deleteUser () {

            swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {

                    UserService.deleteUser($stateParams.userId).then(function (data) {

                        swal({
                            type: "success",
                            title: "删除!",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: true,
                        }, function () {
                            alert('fu')
                            $state.go('userList', {}, {reload: true})
                        })
                    })
                })

        }

        function goBack () {
            $window.history.back();
        }


        $scope.convertToInt = function(id){
            return parseInt(id, 10);
        };
    }
})();