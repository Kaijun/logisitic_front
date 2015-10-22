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
                givenServices: '=',
            }
        };
        return directive;

        function link(scope, element, attrs) {

            var type = parseInt(scope.type);

            if(type){
                scope.services = [];
                InfoService.getExtraServices(type).then(function(data) {
                    scope.services = angular.isArray(data)? data: [data];
                    scope.services.map(function (item) {
                        item.selected = false;
                    })
                });
            }
            else{
                scope.$watch('givenServices', function () {
                    scope.services = scope.givenServices; 
                    scope.services.map(function (item) {
                        item.selected = false;
                    });
                });
                scope.$watch('selectedServices', function (newValue, oldValue) {
                    if(newValue===oldValue) return;
                    if(scope.services.length>0){
                        scope.services.map(function (item) {
                            return item.selected = scope.selectedServices.some(function (item2) {
                                return item.id == item2.id;
                            })
                        });
                        console.log(scope.services)
                    }
                })
            }

            scope.$watch('services', function () {
                //empty array
                if(angular.isArray(scope.selectedServices))
                    scope.selectedServices.length=0;
                scope.services.forEach(function (item) {
                    if (item.selected === true)
                        scope.selectedServices.push(item);
                });
            }, true)
        }
    }

})();