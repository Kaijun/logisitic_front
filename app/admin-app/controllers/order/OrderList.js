(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderList', OrderList);

    OrderList.$inject = ['$scope', 'OrderService', '$timeout', '$state', '$http', 'InfoService', '$stateParams', '$window', '$filter', 'LogisticService'];

    /* @ngInject */
    function OrderList($scope, OrderService, $timeout, $state, $http, InfoService, $stateParams, $window, $filter, LogisticService) {
        $scope.$stateParams = $stateParams;
        $scope.orders = [];
        $scope.allLogisticPaths = [];
        $scope.filterOptions = {
            status: $stateParams.orderStatus || null,
            reference_code: null,
            source_ref: null,
            stock_number: null,
            user_name: null,
            logistic_path: null,
            track_code: null,
            date_type: null,
            start: null,
            end: null,
        };
        $scope.goToDetail = goToDetail;
        $scope.deleteOrder = deleteOrder;
        $scope.batchDownload = batchDownload;
        $scope.batchPrintPackList = batchPrintPackList;
        $scope.batchPrintPostList = batchPrintPostList;
        $scope.batchDownloadEasylog = batchDownloadEasylog;
        $scope.orderSelected = orderSelected;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;
        $scope.selectAllItems = selectAllItems;

        $scope.filter = filter;
        $scope.clearFilter = clearFilter;

        var selectedOrders = [];

        activate();

        ////////////////

        function activate() {

            LogisticService.getLogistics().then(function (data) {
                $scope.allLogisticPaths = data;
            });


            var status = $stateParams.orderStatus || '';
            OrderService.getOrders(status).then(function(data){
                if(data.success===true){
                    data = data.data
                    $scope.orders = data.data.filter(function (item) {
                        return item.id;
                    });
                    $scope.orders.map(function (item) {
                        item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                        item.dateStr = item.created_at.substring(0, 10);
                        item.selected = arrayExist(selectedOrders, item);
                    })
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function goToDetail (orderId) {
            $state.go('orderDetail', {orderId: orderId});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                var data = response.data
                if(data.success === true ){
                    $scope.orders = data.data.data.filter(function (item) {
                        return item.id;
                        // return item.ship_status !== null;
                    });
                    $scope.orders.map(function (item) {
                        item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                        item.dateStr = item.created_at.substring(0, 10);
                        item.selected = arrayExist(selectedOrders, item);
                    })
                    $timeout(function () {
                        $scope.pageInfo = response.data;
                    })
                }
            })
        }

        function deleteOrder (order) {
            if(order.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    OrderService.deleteOrder(order.id).then(function(data) {
                        if(data.success===true){
                            swal("删除成功", "", "success");
                            $scope.orders.map(function (item, index, arry) {
                                if(item === order){
                                    arry.splice(index, 1);
                                }
                            })
                        }
                    });
                })
            }
        }


        function orderSelected (order) {
            if(order.selected===true){
                selectedOrders.push(order);
            }
            else{
                selectedOrders.map(function (item, idx, arry) {
                    if(item === order){
                        arry.splice(idx, 1);
                    }
                })
            }
        }


        function selectAllItems () {
            var shouldSelectAll = $scope.orders.some(function (item) {
                return item.selected === false;
            });
            if(shouldSelectAll){
                $scope.orders.filter(function (order) {
                    return order.selected === false;
                }).forEach(function (order) {
                    order.selected = true;
                    selectedOrders.push(order);
                });
                $scope.isAllSelected = true;
            }
            else{
                $scope.orders.forEach(function (order) {
                    order.selected = false;
                    selectedOrders.map(function (item, idx, arry) {
                        if(parseInt(item.id) === (order.id)){
                            arry.splice(idx, 1);
                        }
                    });

                })
                $scope.isAllSelected = false;
            }

        }
        function arrayExist (array, item) {
            if(angular.isArray(array)){
                return array.some(function (i) {
                    return parseInt(item.id) === parseInt(i.id)
                });
            }
        }
        function batchDownload () {
            if(!selectedOrders || selectedOrders.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            var ids = [];
            selectedOrders.forEach(function (item) {
                ids.push(item.id);
            });
            OrderService.batchDownload(ids);
        }
        function batchPrintPackList () {
            if(!selectedOrders || selectedOrders.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            $window.localStorage.setItem('printPrepareListData', angular.toJson(selectedOrders));
            var url = $state.href('printPrepareList');
            var newWindow = $window.open(url,'_blank');
            // 修改过打印的状态
            swal({
                    title: "已打印?",
                    text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function(){
                    for (var i = selectedOrders.length - 1; i >= 0; i--) {
                        if(selectedOrders[i].order_status == 1){
                             OrderService.editOrder(selectedOrders[i].id, {
                                order_status: 7,
                            })
                        }
                    };
                    $state.go($state.current, {}, {reload: true});
               })

        }
        function batchPrintPostList () {
            if(!selectedOrders || selectedOrders.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            $window.localStorage.setItem('printShipData', angular.toJson(selectedOrders));
            var url = $state.href('printShip');
            var newWindow = $window.open(url,'_blank');
        //     swal({
        //             title: "已打印?",
        //             text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
        //             showCancelButton: true,
        //             confirmButtonColor: "#DD6B55",
        //             cancelButtonText: "取消",
        //             confirmButtonText: "确定",
        //             closeOnConfirm: true,
        //         }, function(){
        //             for (var i = selectedOrders.length - 1; i >= 0; i--) {
        //                 if(selectedOrders[i].order_status == 3){
        //                      OrderService.editOrder(selectedOrders[i].id, {
        //                         order_status: 4,
        //                     })
        //                 }
        //             };
        //             $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
        //        })
        }

        function batchDownloadEasylog() {
            swal({
                title: "已下载？",
                text: "若已下载, 请点击确认修改运单状态",
                showCancelButton: true,
                closeOnConfirm: true,
            }, function(){

                // 下载easylog文件
                var easylogData = '';
                selectedOrders.forEach(function(order, idx) {
                    easylogData = easylogData
                        + order.package.reference_code + '|'
                        + order.post_address.receiver_name + '|'
                        + order.post_address.post_code + '|'
                        + order.post_address.province + '|'
                        + order.post_address.city + order.post_address.street + '|'
                        + order.post_address.phone + '|'
                        + 'CN' + '|'
                        + $filter('number')(order.weight,1).toString().replace(/\./g, ",") + '|'
                        + 1 + '|'
                        + 3;
                    if(idx<selectedOrders.length-1){
                        easylogData = easylogData + '\n';
                    }
                })

                downloadCSV(new Date().toISOString().substring(0,10) + '_easylog.csv', easylogData)
                // OrderService.editOrder($stateParams.orderId, {
                //     order_status: 4,
                // }).then(function() {
                //     $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
                //  })
            })

            function downloadCSV(filename, text) {
              var element = document.createElement('a');
              element.setAttribute('href', 'data:application/csv;charset=utf-8,' + encodeURIComponent(text));
              element.setAttribute('download', filename);

              element.style.display = 'none';
              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
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
            OrderService.queryOrders(opt).then(function(data) {
                if(data.success===true){
                    data = data.data
                    $scope.orders = data.data.filter(function (item) {
                        return item.id;
                    });
                    $scope.orders.map(function (item) {
                        item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                        item.dateStr = item.created_at.substring(0, 10);
                        item.selected = arrayExist(selectedOrders, item);
                    })
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function clearFilter() {
            $state.go($state.current, {stockStatus: $stateParams.stockStatus}, {reload: true})
        }

    }
})();
