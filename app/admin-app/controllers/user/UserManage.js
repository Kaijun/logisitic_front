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
        // $scope.resetPassword = resetPassword;
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
                }, function () {

                    UserService.deleteUser($stateParams.userId).then(function (data) {

                        swal({
                            type: "success",
                            title: "删除成功!",
                            showCancelButton: false,
                        }, function () {
                            $state.go('userList', {}, {reload: true})
                        })
                    })
                })

        }
        // function resetPassword (email) {
        //     if(email){

        //         swal({
        //             title: "确认重置用户密码?",
        //             showCancelButton: true,
        //         }, function () {

        //             UserService.resetPassword(email).then(function (data) {

        //                 swal({
        //                     type: "success",
        //                     title: "重置成功!",
        //                     text: "用户将收到重置密码邮件",
        //                     showCancelButton: false,
        //                 })
        //             })
        //         })
        //     }

        // }

        function goBack () {
            $window.history.back();
        }


        $scope.convertToInt = function(id){
            return parseInt(id, 10);
        };
    }
})();