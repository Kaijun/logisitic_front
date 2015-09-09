(function() {
    'use strict';

    angular
        .module('admin')
        .controller('PersonalInfoCtrl', PersonalInfoCtrl);

    PersonalInfoCtrl.$inject = ['$scope', '$timeout', 'ProfileService', 'UserInfo'];

    /* @ngInject */
    function PersonalInfoCtrl($scope, $timeout, ProfileService, UserInfo) {

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
    }
})();