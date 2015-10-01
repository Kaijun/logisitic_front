(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('ConversationCtrl', ConversationCtrl);

    ConversationCtrl.$inject = ['$scope', 'MsgService', '$timeout', '$stateParams', '$state', 'UserInfo'];

    /* @ngInject */
    function ConversationCtrl($scope, MsgService, $timeout, $stateParams, $state, UserInfo) {
        var conversationId = $stateParams.id;
        $scope.userId = UserInfo.id;
        $scope.conversation = null;
        $scope.textToSend = '';
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

        $scope.sendMsg = function(){
            if($scope.textToSend.length>0){
                MsgService.sendMessageInConv(conversationId, {
                    content: $scope.textToSend
                }).then(function (data) {
                    console.log(data);
                })
            }
        }
    }
})();