(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Shell', Shell);

    Shell.$inject = [];

    /* @ngInject */
    function Shell() {
        var vm = this;
        vm.title = 'Controller';
        console.log('Shell initialized');
        activate();

        ////////////////

        function activate() {
        }
    }
})();