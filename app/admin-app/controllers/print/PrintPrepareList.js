(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintPrepareList', PrintPrepareList);

    PrintPrepareList.$inject = ['$scope', '$stateParams', '$timeout', '$window', 'LogisticService', 'InfoService'];

    /* @ngInject */
    function PrintPrepareList($scope, $stateParams, $timeout, $window, LogisticService, InfoService) {
        $scope.orders = angular.fromJson($window.localStorage.getItem('printPrepareListData'));
        var logisticTypes = null;
        var logisticPath = null;
        activate();

        ////////////////

        function activate() {
                
            LogisticService.getLogisticTypes().then(function (lts) {
                $scope.orders.forEach(function (order) {
                    InfoService.getLogisticPathById(order.logistic_path_id,0).then(function (lp){
                        order.logisticPath = lp;
                    });

                    order.package.items.forEach(function (item) {
                        lts.some(function (i) {
                            if(item.type == i.id){
                                item.typeName = i.type_name;
                                return true;
                            }
                        })
                    })
                })
            });


                
        }

        $scope.generateBarcode = function(ref, id) {
            $timeout(function () {
                $('#qrcode'+id).qrcode({width: 72,height: 72,text: "http://xxxlbag.com/admin/#/order/"+ id});
                $("#barcode"+id).JsBarcode(ref,{width:1.5,height:72});
            });
        }

    }
})();