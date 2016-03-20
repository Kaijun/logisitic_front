(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Shell', Shell);

    Shell.$inject = ['$scope', '$state', '$window', '$stateParams', 'UserInfo'];

    /* @ngInject */
    function Shell($scope, $state, $window, $stateParams, UserInfo) {
        $scope.user = UserInfo;
        $scope.$state = $state;
        $scope.$stateParams = $stateParams;
        console.log('Shell initialized');
        activate();

        ////////////////

        function activate() {
            _setSidebarHeight();


            swal.setDefaults({
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: true,
            });

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
