(function() {
    'use strict';

    angular
        .module('home.services')
        .factory('TransService', TransService);

    TransService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function TransService($http, AppConfig) {
        var service = {
            getTrans: getTrans,
            getCurrentTranss: getCurrentTranss,
            editTrans: editTrans,
            deleteTrans: deleteTrans,
            getTranss: getTranss,
            submitTrans: submitTrans,
            confirmTrans: confirmTrans,
        };
        return service;

        ////////////////

        function getTrans(transId) {
            var promise = $http.get(AppConfig.apiUrl + '/trans-order/' + transId).then(function (response) {
                return response.data;
            });
            return promise;
        }     
        function getCurrentTranss() {
            var promise = getTranss().then(function (data) {
                var data = data.filter(function (item) {
                    var currentDate = new Date();
                    var date = new Date(item.created_at.date);
                    var diff = parseInt((currentDate-date)/(24*3600*1000));
                    return (diff<=7)?true:false;
                });
                return data;
            });
            return promise;
        }
        function deleteTrans(transId) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order/' + transId,
                method: 'DELETE',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }     
        function editTrans(transId, trans) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order/' + transId,
                method: 'PUT',
                data: trans,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }        
        function getTranss() {
            var promise = $http.get(AppConfig.apiUrl + '/trans-order-list/').then(function (response) {
                return response.data;
            });
            return promise;
        }

        function submitTrans(trans) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order/',
                method: 'POST',
                data: trans,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
        function confirmTrans(transId) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/trans-order-confirm/' + transId,
                method: 'POST',
            }).then(function(response){
                return response.data;
            });
            return promise;
        }
    }
})();