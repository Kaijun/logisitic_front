(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('NotificationCtrl', NotificationCtrl);

    NotificationCtrl.$inject = ['$scope', 'MsgService', '$timeout', '$state'];

    /* @ngInject */
    function NotificationCtrl($scope, MsgService, $timeout, $state) {

        $scope.conversations = [];

        $scope.goToDetail = goToDetail;

        activate();

        ////////////////

        function activate() {
            MsgService.getConversations().then(function (data) {
                $timeout(function () {
                    $scope.conversations = data;
                });
            });
        }

        function goToDetail (id) {
            $state.go('messaage', {id: id});
        }
    }
})();