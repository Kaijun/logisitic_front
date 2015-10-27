(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['$scope', '$state', '$window'];

    /* @ngInject */
    function Shell($scope, $state, $window) {
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

        $scope.goBack = function () {
            $window.history.back();
        }

    }
})();