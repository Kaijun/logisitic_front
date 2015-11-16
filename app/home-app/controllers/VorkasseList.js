(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('VorkasseListCtrl', VorkasseListCtrl);

    VorkasseListCtrl.$inject = ['$scope', 'VorkasseService', 'InfoService', '$filter', '$timeout', '$state', 'ngTableParams'];

    /* @ngInject */
    function VorkasseListCtrl($scope, VorkasseService, InfoService, $filter, $timeout, $state, ngTableParams) {
        
        $scope.filterList = [];
        $scope.vorkasseList = [];
        $scope.goToDetail = goToDetail;
        $scope.toggleStatusFilter = toggleStatusFilter;
        $scope.deleteVorkasse = deleteVorkasse;
        $scope.toggleStatus = -1;
        $scope.searchText = "";

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: $scope.vorkasseList.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve($scope.filterList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total($scope.filterList.length); // set total for recalc pagination
            }
        })
        active();

        function active () {
            VorkasseService.getVorkasses().then(function (list) {
                // list = list.filter(function (item) {
                //     return item.status==-1 || item.status==0 || item.status==1 || item.status==2 || item.status==-3 || item.status==4 || item.status==5;
                // })
                list.map(function (item) {
                    item.created_at = item.created_at.substring(0, 10);
                    item.statusStr = InfoService.getVorkasseStatusMapping(parseInt(item.status));
                    return item;
                })
                $scope.vorkasseList = list;
                $scope.filterList = list;
                $scope.tableParams.reload();
            });

            $scope.$watch('searchText', function (newValue, oldValue) {
                
            });
        }
        
        function toggleStatusFilter(statusId){
            if(statusId===-1){
                $scope.filterList = $scope.vorkasseList;
            }
            else{
                $scope.filterList = $filter('filter')($scope.vorkasseList, {status: statusId});
            }
            $scope.toggleStatus = statusId;
            $scope.tableParams.reload();
        }

        function goToDetail (id) {
            $state.go('vorkasseDetail', {id: id});
        }
        function deleteVorkasse (vk) {
            if(vk.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    VorkasseService.deleteVorkasse(vk.id).then(function() {
                        swal('删除成功', '', 'success');
                        var idx = $scope.vorkasseList.indexOf(vk);
                        if(idx > -1){
                            $scope.vorkasseList.splice(idx, 1);
                            $scope.tableParams.reload();
                        }
                    });
                })
            }
        }
    }
})();