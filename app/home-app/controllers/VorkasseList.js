(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('VorkasseListCtrl', VorkasseListCtrl);

    VorkasseListCtrl.$inject = ['$scope', 'VorkasseService', 'InfoService', '$filter', '$timeout', '$state', 'ngTableParams'];

    /* @ngInject */
    function VorkasseListCtrl($scope, VorkasseService, InfoService, $filter, $timeout, $state, ngTableParams) {
        
        var filterList = [];
        $scope.vorkasseList = [];
        $scope.goToDetail = goToDetail;
        $scope.toggleStatusFilter = toggleStatusFilter;
        $scope.toggleStatus = -1;
        $scope.searchText = "";

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: $scope.vorkasseList.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve(filterList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total(filterList.length); // set total for recalc pagination
            }
        })
        active();

        function active () {
            VorkasseService.getVorkasses().then(function (list) {
                // list = list.filter(function (item) {
                //     return item.status==-1 || item.status==0 || item.status==1 || item.status==2 || item.status==-3 || item.status==4 || item.status==5;
                // })
                list.map(function (item) {
                    item.created_at = (new Date(item.created_at)).toISOString().substring(0, 10);
                    item.statusStr = InfoService.getVorkasseStatusMapping(parseInt(item.status));
                    return item;
                })
                $scope.vorkasseList = list;
                filterList = list;
                $scope.tableParams.reload();
            });

            $scope.$watch('searchText', function (newValue, oldValue) {
                
            });
        }
        
        function toggleStatusFilter(statusId){
            if(statusId===-1){
                filterList = $scope.vorkasseList;
            }
            else{
                filterList = $filter('filter')($scope.vorkasseList, {status: statusId});
            }
            $scope.toggleStatus = statusId;
            $scope.tableParams.reload();
        }

        function goToDetail (id) {
            $state.go('vorkasseDetail', {id: id});
        }
    }
})();