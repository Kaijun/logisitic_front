(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ScoreSetting', ScoreSetting);

    ScoreSetting.$inject = ['$scope', '$timeout', '$window', 'ScoreService'];

    /* @ngInject */
    function ScoreSetting($scope, $timeout, $window, ScoreService) {
      ScoreService.getScoreSetting().then(function(data) {
        $scope.setting = data;
      })

      $scope.editSetting = function() {
        console.log($scope.setting);
        ScoreService.editScoreSetting($scope.setting).then(function(data) {
          if(data.success){
            swap('修改设置成功', '', 'success');
          }
        })
      }
    }
})();
