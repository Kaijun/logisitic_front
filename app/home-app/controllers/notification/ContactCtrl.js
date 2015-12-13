(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('ContactCtrl', ContactCtrl);

    ContactCtrl.$inject = ['$scope', '$state', '$timeout', 'MsgService'];

    /* @ngInject */
    function ContactCtrl($scope, $state, $timeout, MsgService) {
        $scope.msg = {
            title: null,
            content: null,
            reference_code: null,
        }

        $scope.send = function () {
            if($scope.msg.title && $scope.msg.content){
                MsgService.contactService($scope.msg).then(function (data) {
                    if(data.success===true){
                        swal('发送成功', '', 'success')
                    }
                })
            }
        }
    }
})();