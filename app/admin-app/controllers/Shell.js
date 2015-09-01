(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['$scope', '$state'];

    /* @ngInject */
    function Shell($scope, $state) {
        $scope.$state = $state;
        console.log('Shell initialized');
        activate();

        ////////////////

        function activate() {
            _setSidebarHeight();
        }

        function _setSidebarHeight(){
            var $sidebar = $('.ah-sidebar');
            var sidebarTopOffset = $sidebar.offset().top;
            var height = $(window).height() - sidebarTopOffset;
            if($sidebar.outerHeight()<height) $sidebar.outerHeight(height);
        }
    }
})();