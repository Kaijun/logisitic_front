(function() {
    'use strict';

    angular
        .module('home.services')
        .service('ProfileService', ProfileService);

    ProfileService.$inject = ['$http', 'AppConfig', '$cacheFactory'];

    /* @ngInject */
    function ProfileService($http, AppConfig, $cacheFactory) {
        var profileCache = $cacheFactory('profile');
        return {
            getAddressList: getAddressList,
            getAddress: getAddress,
            submitAddress: submitAddress,
            editAddress: editAddress,
            deleteAddress: deleteAddress,

            editPersonalInfo: editPersonalInfo,
        }

        ////////////////

        function getAddressList() {
            if(profileCache.get('addressList')){
                return profileCache.get('addressList');
            }
            var promise = $http.get(AppConfig.apiUrl + '/addresslist').then(function (response) {
                return response.data;
            });
            profileCache.put('addressList', promise);
            return promise;
        }
        function getAddress(id) {
            var promise = $http.get(AppConfig.apiUrl + '/address/' + id).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function submitAddress (addr) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/address/',
                method: 'POST',
                data: addr,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                profileCache.remove('addressList');
                return response.data;
            });
            return promise;
        }
        function editAddress (id, addr) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/address/' + id,
                method: 'PUT',
                data: addr,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                profileCache.remove('addressList');
                return response.data;
            });

            return promise;
        }
        function deleteAddress (id) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/address/' + id,
                method: 'DELETE',
            }).then(function(response){
                return response.data;
            });
        }

        function editPersonalInfo (pi) {
            var promise =  $http({
                url: AppConfig.apiUrl + '/api/putUserProfile/',
                method: 'PUT',
                data: pi,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                return response.data;
            });
        }
    }
})();