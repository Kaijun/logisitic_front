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
                    isID: function (value) {
                        if(value===null || value.length===0 || value.toString().trim().length===0){
                            return true;
                        }
                        var patt = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                        return patt.test(value);
                    },
                    isPhone: function (value) {
                        if(value.toString().trim().length===0){
                            return true;
                        }
                        var patt = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
                        return patt.test(value);
                    },
                    maxvalue: function(value, scope, element, attrs, param) {
                      return parseInt(value,10) <= parseInt(param,10);
                    },
                    minvalue: function(value, scope, element, attrs, param) {
                      return parseInt(value,10) >= parseInt(param,10);
                    },
                }) // set expression
                .setDefaultMsg({
                    required: {
                        error: '此项必填',
                    },
                    email: {
                        error: '邮箱格式不正确',
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
                    maxvalue: {
                        error: '不能超出最大值',
                    },
                    minvalue: {
                        error: '不能小于最小值',
                    },
                }); // set valid message

        }]);
})();