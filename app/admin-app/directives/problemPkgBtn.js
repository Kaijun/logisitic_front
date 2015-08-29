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
                var status = 0;
                if(scope.currentStatus<=3){
                    status = 4;
                }
                else if(scope.currentStatus<=4){
                    status = 5;
                }
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

})();