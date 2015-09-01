(function() {
    'use strict';

    angular
        .module('admin.directives')
        .directive('problemPkgBtn', problemPkgBtn);

    problemPkgBtn.$inject = ['$http', 'ProblemService'];

    /* @ngInject */
    function problemPkgBtn ($http, ProblemService) {
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
            }

            scope.markAsProblemPkg = function () {
                if(scope.type==0){
                    var status = 0;
                    if(scope.currentStatus<=3){
                        status = 3;
                    }
                    else if(scope.currentStatus<=5){
                        status = 5;
                    }
                    else if(scope.currentStatus<=9){
                        status = 9;
                    }
                    ProblemService.newProblemPkg({
                        "package_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "status": status, 
                    }).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
                else if(scope.type==1){
                    var order_status = 6;
                    ProblemService.newProblemPkg({
                        "package_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "order_status": order_status, 
                    }).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
                else if(scope.type==2){
                    status = 4;
                    ProblemService.newProblemPkg({
                        "package_id": scope.packageId, 
                        "description": scope.problemDesc, 
                        "status": status, 
                    }).then(function () {
                        scope.dismissProblemPopup();
                    })
                }
            }
        }
    }

})();