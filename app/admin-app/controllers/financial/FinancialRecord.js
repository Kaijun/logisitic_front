(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('FinancialRecord', FinancialRecord);

    FinancialRecord.$inject = ['$scope', '$timeout', '$state', 'FinanceService', '$http'];

    /* @ngInject */
    function FinancialRecord($scope, $timeout, $state, FinanceService, $http) {
        $scope.records = [];
        $scope.pageInfo = null;
        $scope.requestPage = requestPage;
        $scope.filterOptions = {
            user_name: null,
            amount: null,
            start: null,
            end: null,
        };
        $scope.filter = filter;
        $scope.clearFilter = clearFilter;
        $scope.selectAllItems = selectAllItems;
        $scope.recordSelected = recordSelected;
        $scope.exportRecord = exportRecord;
        activate();


        var selectedRecordIds = [];

        ////////////////

        function activate() {
            FinanceService.getRecords().then(function (data) {
                if(data.success===true){
                    data = data.data
                    $scope.records = data.data;
                    $scope.records.map(function(item) {
                        item.selected = arrayExist(selectedRecordIds, item.id);
                    })
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }

        function requestPage (url) {
            $http.get(url).then(function (response) {
                response = response.data;
                if(response.success===true){
                    $scope.records = response.data.data;
                    $scope.records.map(function(item) {
                        item.selected = arrayExist(selectedRecordIds, item.id);
                    })
                    $timeout(function () {
                        $scope.pageInfo = response.data;
                    }) 
                }
            })
        }
        function arrayExist (array, item) {
            if(angular.isArray(array)){
                return array.indexOf(item) > -1;
            }
        }
        function selectAllItems () {
            var shouldSelectAll = $scope.records.some(function (item) {
                return item.selected === false;
            });
            if(shouldSelectAll){
                $scope.records.filter(function (r) {
                    return r.selected === false;
                }).forEach(function (r) {
                    r.selected = true;
                    selectedRecordIds.push(r.id);
                });
                $scope.isAllSelected = true;
            }
            else{
                $scope.records.forEach(function (r) {
                    r.selected = false;
                    selectedRecordIds.map(function (item, idx, arry) {
                        if(item === r.id){
                            arry.splice(idx, 1);
                        }
                    });

                })
                $scope.isAllSelected = false;
            }

        }

        function recordSelected (record) {
            if(record.selected===true){
                selectedRecordIds.push(record.id);
            }
            else{
                selectedrecordIds.map(function (item, idx, arry) {
                    if(item === record.id){
                        arry.splice(idx, 1);
                    }
                })
            }
        }

        function filter() {
            var opt = angular.copy($scope.filterOptions);
            if(opt.start instanceof Date && opt.end instanceof Date && opt.start>opt.end){
                swal('起始时间不能晚于截至时间', '', 'error')
                return 
            }
            if(opt.start instanceof Date) opt.start = opt.start.toISOString().substr(0,10);
            if(opt.end instanceof Date) opt.end = opt.end.toISOString().substr(0,10);
            FinanceService.queryRecords(opt).then(function(data) {
                if(data.success===true){
                    data = data.data
                    $scope.records = data.data;

                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function clearFilter() {
            $state.go($state.current, {}, {reload: true})
        }
        function exportRecord() {
            if(!selectedRecordIds || selectedRecordIds.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            FinanceService.exportRecords(selectedRecordIds);
        }
    }
})();