(function() {
    'use strict';

    angular
        .module('home.directives')
        .directive('extraServiceList', extraServiceList);

    extraServiceList.$inject = ['InfoService'];

    /* @ngInject */
    function extraServiceList (InfoService) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            templateUrl: 'directives/extraServiceList.html',
            restrict: 'A',
            scope: {
                selectedServices: '=',
                type: '@',
                userGroup: '@',
            }
        };
        return directive;

        function link(scope, element, attrs) {

            var type = parseInt(scope.type);
            var userGroup = parseInt(scope.userGroup);

            scope.services = [];
            InfoService.getExtraServices(type, userGroup).then(function(data) {
                scope.services = angular.isArray(data)? data: [data];
                scope.services.map(function (item) {
                    item.selected = false;
                })
            });

            scope.$watch('services', function () {
                scope.selectedServices = [];
                scope.services.forEach(function (item) {
                    if (item.selected === true)
                        scope.selectedServices.push(item);
                });
            }, true)
        }
    }

})();