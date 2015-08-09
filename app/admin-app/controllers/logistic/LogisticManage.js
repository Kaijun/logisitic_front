(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticManage', LogisticManage);

    LogisticManage.$inject = ['$scope'];

    /* @ngInject */
    function LogisticManage($scope\) {
        var vm = this;
        vm.title = 'LogisticManage';

        activate();

        ////////////////

        function activate() {
        }
    }
})();