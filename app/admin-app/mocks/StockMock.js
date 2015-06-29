(function() {
    'use strict';

    angular.module('admin.mocks')
    .run(function($httpBackend, AppConfig){

        $httpBackend.whenGET(/templates\//).passThrough();

        $httpBackend.whenGET(AppConfig.apiUrl + '/stocks').respond((function () {
            var stock = {
                id: "132",
                timestamp: "2015-03-25",
                ship_info: "DHLXXXXXX542XX",
                desc: "我是包裹备注",
                status: "2",
            }
            var stocks = [];
            for(var i=0; i<20; i++){
                stocks.push(stock);
            }
            return stocks;
        })());

        $httpBackend.whenGET(AppConfig.apiUrl + '/stocks/132').respond({
            warehouse: "柏林",
            desc: "我是包裹备注",
            ship_company: "DHL",
            ship_tracknumber: "DHLXXXXXX542XX",
            status: "2",
            timestamp: "2015-03-25",
            items: [
                {item_name: "奶粉", type: "乳制品", unit_price: "25", unit_weight: "1kg", quantity: "5"},
                {item_name: "奶粉", type: "乳制品", unit_price: "25", unit_weight: "1kg", quantity: "5"},
                {item_name: "奶粉", type: "乳制品", unit_price: "25", unit_weight: "1kg", quantity: "5"},
                {item_name: "奶粉", type: "乳制品", unit_price: "25", unit_weight: "1kg", quantity: "5"},
            ],
            message: "我是包裹留言",
            attachment: "/image/xxx.jpg",
            extra_services: [],
        });        

        $httpBackend.whenPOST(AppConfig.apiUrl + '/stocks/').respond(function(){
            return [200, {status: "success", message: "添加入库成功"}, {}];
        });       
        $httpBackend.whenPUT(AppConfig.apiUrl + '/stocks/132').respond(function(){
            return [200, {status: "success", message: "修改入库信息成功"}, {}];
        });
        
    });
})();