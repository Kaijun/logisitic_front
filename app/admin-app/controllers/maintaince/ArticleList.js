(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ArticleList', ArticleList);

    ArticleList.$inject = ['$scope', '$timeout', 'ArticleService', '$http', '$state'];

    /* @ngInject */
    function ArticleList($scope, $timeout, ArticleService, $http, $state) {

        $scope.articles = null;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;
        $scope.editArticle = editArticle;
        $scope.newArticle = newArticle;
        $scope.deleteArticle = deleteArticle;

        activate();

        ////////////////

        function activate() {
            ArticleService.getArticles().then(function(data){
                data.data.forEach(function (item) {
                    item.created_at = item.created_at.substring(0,10);
                    item.updated_at = item.updated_at.substring(0,10);
                })
                $scope.articles = data.data;
                $timeout(function () {
                    $scope.pageInfo = data;
                })
            })
        }

        function requestPage (url) {
            $http.get(url).then(function (response) {
                response.data.data.forEach(function (item) {
                    item.created_at = item.created_at.substring(0,10);
                    item.updated_at = item.updated_at.substring(0,10);
                })
                $scope.articles = response.data.data;
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }

        function editArticle (id) {
            $state.go('articleManage', {articleId: id}, {reload: true});
        }
        function deleteArticle (id) {
            if(id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    ArticleService.deleteArticle(id).then(function(data) {
                        $scope.articles.map(function (item, index, arry) {
                            if(item.id === id){
                                arry.splice(index, 1);
                            }
                        })
                    });
                })
            }
        }
        function newArticle () {
            $state.go('articleManage', {articleId: null}, {reload: true});
        }
    }
})();