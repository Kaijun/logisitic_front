(function() {
    'use strict';

    angular
        .module('admin.directives')
        .directive('problemPkgBtn', problemPkgBtn);

    problemPkgBtn.$inject = ['$http', 'ProblemService', '$state', '$stateParams'];

    /* @ngInject */
    function problemPkgBtn ($http, ProblemService, $state, $stateParams) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            templateUrl: 'directives/problemPkgBtn.html',
            restrict: 'A',
            scope: {
                packageId: "@",
                // Type: 0-stock, 1-order, 2-代刷
                type: "@",
                currentStatus: "@",
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.problemPopupShown = false;
            scope.problemDesc = null;

            scope.showProblemPopup = function () {
                scope.problemPopupShown = true;
            }

            scope.dismissProblemPopup = function () {
                scope.problemPopupShown = false;
                scope.problemDesc = null;
                $state.go($state.current, $stateParams, {reload: true});
            }

            scope.markAsProblemPkg = function () {
                //0- 预报问题件
                if(scope.type==0){
                    var status = 3;
                    ProblemService.newProblemPkg({
                        "package_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "status": status, 
                    }, 0).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
                //1- 订单问题件
                else if(scope.type==1){
                    var order_status = 6;
                    ProblemService.newProblemPkg({
                        "ship_order_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "order_status": order_status, 
                    }, 1).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
                //2- 移库问题件
                else if(scope.type==2){
                    var status = 9;
                    ProblemService.newProblemPkg({
                        "transaction_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "status": status, 
                    }, 2).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
                //3- 库存问题件
                else if(scope.type==3){
                    var status = 5;
                    ProblemService.newProblemPkg({
                        "package_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "status": status, 
                    }, 3).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
            }
        }
    }

})();