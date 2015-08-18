(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('MessageCtrl', MessageCtrl);

    MessageCtrl.$inject = ['$scope', 'MsgService', '$timeout', '$stateParams', '$state'];

    /* @ngInject */
    function MessageCtrl($scope, MsgService, $timeout, $stateParams, $state) {
        var conversationId = $stateParams.id;
        $scope.conversation = null;
        activate();

        ////////////////

        function activate() {
            if(conversationId){
                MsgService.getConversationById(conversationId).then(function (data) {
                    $timeout(function () {
                        $scope.conversation = data;
                    });
                }, function () {
                    $state.go('index');
                })
            }
            else{
                $state.go('index');
            }
        }
    }
})();