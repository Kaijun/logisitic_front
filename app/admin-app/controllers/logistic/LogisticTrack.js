(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticTrack', LogisticTrack);

    LogisticTrack.$inject = ['$scope', '$state', '$timeout', 'LogisticService'];

    /* @ngInject */
    function LogisticTrack($scope, $state, $timeout, LogisticService) {
        var vm = this;
        vm.title = 'LogisticTrack';

        activate();

        ////////////////

        function activate() {
        }
    }
})();