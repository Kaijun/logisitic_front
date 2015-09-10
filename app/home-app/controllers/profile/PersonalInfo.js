(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('PersonalInfoCtrl', PersonalInfoCtrl);

    PersonalInfoCtrl.$inject = ['$scope', '$timeout', 'ProfileService', 'UserInfo', '$window'];

    /* @ngInject */
    function PersonalInfoCtrl($scope, $timeout, ProfileService, UserInfo, $window) {

        $scope.personalInfo = {
            "name": UserInfo.name,
            "QQ": UserInfo.QQ,
            "wechat": UserInfo.wechat,
            "phone_number": UserInfo.phone_number,
            "ID_card_number": UserInfo.ID_card_number,
            "ID_card_scan_1": UserInfo.ID_card_scan_1,
            "ID_card_scan_2": UserInfo.ID_card_scan_2,
            "real_name": UserInfo.real_name,
        }

        activate();

        ////////////////

        function activate() {


        }

        $scope.editProfile = function () {
            ProfileService.editPersonalInfo($scope.personalInfo).then(function () {
                swal({
                    type: "success",
                    title: "修改成功!",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    $window.location.reload();
                })
            })
        }
    }
})();