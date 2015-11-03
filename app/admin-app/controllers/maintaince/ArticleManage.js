(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ArticleManage', ArticleManage);

    ArticleManage.$inject = ['$scope', '$timeout', 'ArticleService', '$stateParams', '$state'];

    /* @ngInject */
    function ArticleManage($scope, $timeout, ArticleService, $stateParams, $state) {

        var articleObj = {
            title: '',
            body: '',
            type: '0'
        }
        $scope.article = null;
        $scope.deleteArticle = deleteArticle;
        $scope.publish = publish;
        $scope.saveArticle = saveArticle;

        var simditor;
        $scope.isEdit = false;
        activate();

        ////////////////

        function activate() {
            if($stateParams.articleId){
                $timeout(function function_name (argument) {
                    $scope.isEdit = true;
                })
                ArticleService.getArticle($stateParams.articleId).then(function (data) {
                    data.type = ''+data.type;
                    $scope.article = data;
    
                    $timeout(function () {
                        simditor = new Simditor({ textarea: $('#editor'), upload: { url: '/api/admin/image', fileKey: 'image' } });
                        simditor.setValue($scope.article.body);
                    })
                }, function () {
                    $state.go('articleList', {}, {reload: true});
                })
            }
            else{
                $scope.article = angular.copy(articleObj)
                $timeout(function function_name (argument) {
                    $scope.isEdit = false;
                    simditor = new Simditor({ textarea: $('#editor'), upload: { url: '/api/admin/image', fileKey: 'image' } });
                })
            }
        }

        function saveArticle(){
            $scope.article.body = simditor.getValue();
            if($scope.isEdit){
                ArticleService.editArticle($stateParams.articleId, $scope.article).then(function () {
                    $state.go('articleManage', {articleId: $stateParams.articleId}, {reload: true});
                })
            }
            else{
                ArticleService.submitArticle($scope.article).then(function (data) {
                    $state.go('articleManage', {articleId: data}, {reload: true});
                })
            }
        }
        function publish(bool){
            if($scope.isEdit){
                $scope.article.unpublish = bool? "false" : "true";
                ArticleService.editArticle($stateParams.articleId, $scope.article).then(function () {
                    $state.go('articleManage', {articleId: $stateParams.articleId}, {reload: true});
                })
            }
        }

        function deleteArticle () {
            if($stateParams.articleId){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    ArticleService.deleteArticle($stateParams.articleId).then(function(data) {
                        $state.go('articleList', {}, {reload: true});
                    });
                })
            }
        }
    }
})();