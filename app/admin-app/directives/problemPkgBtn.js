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
                problemStatus: "@",
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
                ProblemService.newProblemPkg({
                    "package_id": scope.packageId, 
                    "description": scope.problemDesc, 
                    "status": scope.problemStatus, 
                }).then(function () {
                    scope.dismissProblemPopup();
                })
            }
        }
    }

})();