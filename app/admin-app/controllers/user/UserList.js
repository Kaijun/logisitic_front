(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('UserList', UserList);

    UserList.$inject = ['$scope', 'UserService', '$timeout', '$http', '$state', 'RoleService'];

    /* @ngInject */
    function UserList($scope, UserService, $timeout, $http, $state, RoleService) {
        
        $scope.users = [];
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;
        $scope.editUser = editUser;
        $scope.roles = [];

        $scope.filterOptions = {
            user_name: null,
            email: null,
            stock_name: null,
            stock_position: null,
            role: null,
        };

        $scope.filter = filter;
        $scope.clearFilter = clearFilter;

        activate();

        ////////////////


        function activate() {
            RoleService.getRoles().then(function(data) {
                $scope.roles = data;
            })

            UserService.getUsers().then(function(data){
                if(data.success===true){
                    data = data.data
                    $scope.users = data.data;
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function editUser (userId) {
            $state.go('userManage', {userId: userId});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                response = response.data
                if(response.success===true){
                    $scope.stocks = response.data.data;
                    $scope.stocks.map(function (item) {
                        item.selected = arrayExist(selectedStocks, item.package_id);
                    });
                    $timeout(function () {
                        $scope.pageInfo = response.data;
                    })
                }
            })
        }
        function filter() {
            var opt = angular.copy($scope.filterOptions);
            UserService.queryUsers(opt).then(function(data) {
                if(data.success===true){
                    data = data.data
                    $scope.users = data.data;
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function clearFilter() {
            $state.go($state.current, {}, {reload: true})
        }
    }
})();