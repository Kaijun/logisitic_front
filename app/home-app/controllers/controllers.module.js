(function() {
    'use strict';

    angular
        .module('home.controllers', [
            'ngTable',
            'angular.city.select',
            'validation',
            'validation.rule',
        ]).config(['$validationProvider',function($validationProvider) {

            // Validation Configuration

            $validationProvider.setErrorHTML(function (msg) {
                return  "<label class=\"invalid-label\">" + msg + "</label>";
            });

            $validationProvider.setSuccessHTML(function (msg) {
                return '';
            });
            angular.extend($validationProvider, {
                validCallback: function (element){
                    $(element).addClass('valid-input');
                    $(element).removeClass('invalid-input');
                },
                invalidCallback: function (element) {
                    $(element).addClass('invalid-input');
                    $(element).removeClass('valid-input');
                }
            });

            // Custom Expression

            $validationProvider
                .setExpression({
                    numAndAlphabet: /^[0-9a-zA-Z]+$/,
                    notNumber: function (value) {
                        return isNaN(value);
                    },
                    isID: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    isPhone: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
                }) // set expression
                .setDefaultMsg({
                    required: {
                        error: '此项必填',
                    },
                    number: {
                        error: '必须为数字',
                    },
                    numAndAlphabet: {
                        error: '必须为数字或者字母',
                    },
                    notNumber: {
                        error: '不能为纯数字',
                    },
                    isID: {
                        error: '身份证号码不正确',
                    },
                    isPhone: {
                        error: '手机号码不正确',
                    },
                }); // set valid message

        }]);
})();