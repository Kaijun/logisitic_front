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
            // "default_address_id": null,
        }

        $scope.addrs = [];
        $scope.defaultAddr = null;
        activate();

        ////////////////

        function activate() {

            ProfileService.getAddressList().then(function (data) {
                $scope.addrs = data;
                $scope.defaultAddr = $scope.addrs.filter(function (item) {
                    return parseInt(item.is_default) === 1;
                })[0];

            })
        }

        $scope.editProfile = function () {
            if($scope.defaultAddr){
                $scope.personalInfo.default_address_id = $scope.defaultAddr.id;
            }
            ProfileService.editPersonalInfo($scope.personalInfo).then(function () {
                swal({
                    type: "success",
                    title: "修改成功!",
                    showCancelButton: false,
                    closeOnConfirm: true,
                }, function () {
                    $window.location.reload();
                })
            })
        }
    }
})();