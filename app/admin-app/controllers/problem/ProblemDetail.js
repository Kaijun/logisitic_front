(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ProblemDetail', ProblemDetail);

    ProblemDetail.$inject = ['ProblemService', 'UserInfo', 'InfoService', '$scope', '$timeout', '$state', '$stateParams'];

    /* @ngInject */
    function ProblemDetail(ProblemService, UserInfo, InfoService, $scope, $timeout, $state, $stateParams) {

        $scope.isPopupShown = false;
        $scope.isReplyPopupShown = false;
        $scope.replyContent = '';
        $scope.problemPkg = null;
        $scope.$stateParams = $stateParams;
        $scope.userId = UserInfo.id;

        $scope.solveProblem = solveProblem;
        $scope.solveProblemShow = solveProblemShow;
        $scope.cancle = cancle;
        $scope.replyShow = replyShow;
        $scope.cancleReply = cancleReply;
        $scope.sendMsg = sendMsg;

        var allStatuses = ($stateParams.type==1)? InfoService.getOrderStatusMapping():InfoService.getStockStatusMapping();
        $scope.statusOfType = [];
        switch($stateParams.type){
            //预报问题件 deprecated...
            case "0":
                $scope.statusOfType = allStatuses.slice(2, 4)
                break;
            //订单问题件
            case "1":
                $scope.statusOfType = allStatuses.slice(2, -2).concat(allStatuses.slice(-1));
                break;
            //移库问题件
            case "2":
                $scope.statusOfType = allStatuses.slice(7, -3);
                $scope.statusOfType.splice(-2, 1);
                break;
            //库存问题件
            case "3":
                $scope.statusOfType = allStatuses.slice(2, 4).concat(allStatuses.slice(5, 6));
                break;
        }
        $scope.selectedStatus = $scope.statusOfType[0];

        activate();

        ////////////////

        function activate() {
            if($stateParams.type!==null && $stateParams.id!==null){
                var type = $stateParams.type;
                var id = $stateParams.id;
                ProblemService.getProblemPkg(type, id).then(function (data) {                    
                    data.updated_at = data.updated_at.date.substring(0, 10);
                    if(type==1){
                        data.statusStr = InfoService.getOrderStatusMapping(data.order_status);
                    }
                    else{
                        data.statusStr = InfoService.getStockStatusMapping(data.status);
                    }
                    $scope.problemPkg = data;
                });
            }
        }

        function solveProblem(){
            var problemPkg = {};
            if($stateParams.type==1){
                problemPkg = {
                    order_status: getStatusNumOfArray(allStatuses, $scope.selectedStatus)
                }
            }else{
                problemPkg = {
                    status: getStatusNumOfArray(allStatuses, $scope.selectedStatus)
                }
            }

            ProblemService.solveProblemPkg($stateParams.type, $stateParams.id, problemPkg).then(function (data) {
                if(data.success === true){
                    swal("修改状态成功!", "", "success");
                    $state.go('problemList', {}, {reload: true});
                }
            })
        }

        function sendMsg(){
            if($scope.replyContent.length>0)
            ProblemService.sendMessageInConv($scope.problemPkg.conversation.id, {
                content: $scope.replyContent
            }).then(function (data) {
                if(data.success==true){
                    var currentdate = new Date(); 
                        var datetime =  currentdate.getFullYear() + "-"
                                        + (currentdate.getMonth()+1)  + "-" 
                                        + currentdate.getDate() + " "  
                                        + ("0" + currentdate.getHours()).slice(-2)  + ":"  
                                        + ("0" + currentdate.getMinutes()).slice(-2)  + ":"  
                                        + ("0" + currentdate.getSeconds()).slice(-2); 
                    $scope.problemPkg.conversation.messages.push({
                        from: $scope.userId,
                        created_at: datetime,
                        content: $scope.replyContent
                    });
                    
                    cancleReply();
                }
            })
        }
        function solveProblemShow(){
            $scope.isPopupShown = true;
        }

        function cancle () {
            $scope.isPopupShown = false;
        }
        function replyShow(){
            $scope.isReplyPopupShown = true;
        }

        function cancleReply () {
            $scope.isReplyPopupShown = false;
            $scope.replyContent = '';
        }

        function getStatusNumOfArray(arry, item){
            if(angular.isArray(arry)){
                return arry.indexOf(item)-1;
            }
            return -1;
        }
    }
})();