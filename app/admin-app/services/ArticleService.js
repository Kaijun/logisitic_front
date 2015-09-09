(function() {
    'use strict';

    angular
        .module('admin.services')
        .factory('ArticleService', ArticleService);

    ArticleService.$inject = ['$http', 'AppConfig'];

    /* @ngInject */
    function ArticleService($http, AppConfig) {
        return{
            getArticles: getArticles,
            getArticle: getArticle,
            deleteArticle: deleteArticle,
            editArticle: editArticle,
            submitArticle: submitArticle,
        }

        ////////////////


        function getArticles(type) {
            var url = AppConfig.apiUrl + '/news';
            if(type){
                url = url+'?type='+type
            }
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function getArticle(id) {
            var url = AppConfig.apiUrl + '/news?id='+id;
            var promise = $http({
                url: url,
                method: 'GET',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function deleteArticle(id) {
            var promise = $http({
                url: AppConfig.apiUrl + '/news/' + id,
                method: 'DELETE',
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function submitArticle(a) {
            var promise = $http({
                url: AppConfig.apiUrl + '/news/',
                method: 'PUT',
                data: a,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
        function editArticle(id, a) {
            var promise = $http({
                url: AppConfig.apiUrl + '/news/'+id,
                method: 'PUT',
                data: a,
            }).then(function (response) {
                return response.data;
            });
            return promise;
        }
    }
})();