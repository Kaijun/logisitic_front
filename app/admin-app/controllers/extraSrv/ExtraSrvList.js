(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ExtraSrvList', ExtraSrvList);

    ExtraSrvList.$inject = ['$scope'];

    /* @ngInject */
    function ExtraSrvList($scope) {
        var vm = this;
        vm.title = 'ExtraSrvList';

        activate();

        ////////////////

        function activate() {
        }
    }
})();