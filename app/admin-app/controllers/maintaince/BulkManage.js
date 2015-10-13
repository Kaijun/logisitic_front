(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('BulkManage', BulkManage);

    BulkManage.$inject = ['$scope', '$timeout', 'MessageService', '$state'];

    /* @ngInject */
    function BulkManage($scope, $timeout, MessageService, $state) {
        $scope.bulkList = [];
        
        $scope.isPopupShown = false;
        $scope.popupConfirm = popupConfirm;
        $scope.popupCancle = popupCancle;
        activate();

        ////////////////

        function activate() {
            MessageService.getBulkList().then(function (data) {
                data.forEach(function (item) {
                    item.created_at = (new Date(item.created_at)).toISOString().substring(0, 10);
                })
                $scope.bulkList = data;
            });
        }

        function popupConfirm () {

        }
        function popupCancle () {
            $scope.isPopupShown = false;
        }
    }
})();