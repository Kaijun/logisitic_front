(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticList', LogisticList);

    LogisticList.$inject = ['$scope'];

    /* @ngInject */
    function LogisticList($scope) {
        var vm = this;
        vm.title = 'LogisticList';

        activate();

        ////////////////

        function activate() {
        }
    }
})();