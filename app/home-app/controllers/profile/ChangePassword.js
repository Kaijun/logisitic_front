(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('ChangePassword', ChangePassword);

    ChangePassword.$inject = ['$scope', '$window', '$timeout', 'ProfileService'];

    /* @ngInject */
    function ChangePassword($scope, $window, $timeout, ProfileService) {
        $scope.oldPwd = '';
        $scope.newPwd = '';
        $scope.newPwdConfirm = '';
        activate();

        ////////////////

        function activate() {

        }
        $scope.changePwd = function () {
            if($scope.newPwd === $scope.newPwdConfirm){
                ProfileService.editPassword({
                    'password_old': $scope.oldPwd,
                    'password_new': $scope.newPwd,
                    'password_repeat': $scope.newPwdConfirm
                }).then(function (data) {
                    if(data.success===true){
                        swal("修改密码成功!", "", "success");
                        $scope.oldPwd = '';
                        $scope.newPwd = '';
                        $scope.newPwdConfirm = '';
                    }
                })
            }
            else{
                alert('两次输入密码不一致!')
            }
        }
        $scope.goBack = function (argument) {
            $window.history.back();
        }
        
    }
})();   