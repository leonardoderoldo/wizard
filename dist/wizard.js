/**
 * @license ngWizard 0.1.10
 * (c) 2010-2017 Deroldo, Inc. http://deroldo.com.br
 * License: MIT
 */
(function() {
  'use strict';
  angular.module('ngWizard', []);
})();
(function() {
	'use strict';	
	angular.module('ngWizard')
	.directive('wizard', ['$q', 'util', 'validaForm', function($q, util, validaForm) {
		return {
			restrict: 'E',
			require: '?ngModel',
			scope: {
				wizardConfig: "=?",
				ngModel: '='
			},
			template: '<style>.step-wizard ul.sw-container{position: relative;}.step-wizard ul li.sw-item{float: left; position: relative; margin-right: 20px; font-size: 16px; float: left;color: #F5F5F5; line-height: 60px; color: #F5F5F5; height: 60px; line-height: 60px; padding: 0 45px; border-radius: 3px; background: #c1c1c1;}.step-wizard ul li.sw-item.active{background: #48a3b0;}.step-wizard ul li.sw-item.passed{background: #25575b;}.step-wizard .btn-nav{background: #3d4750; padding-left: 50px;}</style><form name="stepForm" class="step-wizard step-wizard-validation ng-pristine ng-valid" novalidate="novalidate" role="form"> <div class="row m-b-20"> <div class="col-md-12"> <ul class="sw-container  p-l-0"> <li class="sw-item {{$index==step ? \'active\' : $index < step ? \'passed\' : \'\'}}" ng-repeat="s in steps"> <span style="padding-left: 35px;">{{s.title}}</span> <div style="position: absolute; left: 12px; top: 0; font-size: 96px; font-weight: 700; overflow: hidden;"> <span style="font-size: 96px;font-weight: 700;">{{$index+1}}</span> </div><div></div></li></ul> </div></div><div class="row"> <div class="col-md-12"> <div ng-include="steps[step].templateUrl" onload="onFinishLoading()"></div></div></div><div class="row m-t-20"> <div class="col-md-6"> <button ng-show="!isFirst();" class="btn btn-lg btn-dark" style="float: left;" ng-click="clickPrev(stepForm);"> <span class="fa fa-chevron-left"></span> Anterior </button> </div><div class="col-md-6 text-right"> <button ng-show="isLast();" class="btn btn-lg btn-dark" style="float: right;" ng-click="clickNext(stepForm);"> Finalizar <span class="fa fa-chevron-right"></span> </button> <button ng-show="!isLast();" class="btn btn-lg btn-dark" style="float: right;" ng-click="clickNext(stepForm);"> Próximo <span class="fa fa-chevron-right"></span> </button> </div></div></form>',
			link: function(scope, iElement, iAttrs, ngModel) {
				var config = scope.wizardConfig;

				scope.vm = scope.ngModel;
				scope.step = 0;
				scope.stepLoaded = false;
				scope.steps = config.steps;

				function plugins() {
					setTimeout(function () {
						// inputSelect();
					}, 1);
				}

				scope.getIndex = function(){
					return  scope.step + 1;
				};

				scope.isFirst = function(){
					return scope.step === 0 ? true : false;
				};

				scope.isLast =  function(){
					return scope.step === (config.steps.length-1) ? true : false;
				};

				scope.clickNext = function(form){
					if(!form.$valid) return false;
					if(scope.step < (scope.steps.length-1)){
						validaPassos(scope.step)
						.then(function(data){
							if(data){
								if (typeof config.onStepNext === "function") {
									config.onStepNext();
								}
								scope.step = scope.step + 1;
								plugins();
								form.$setPristine();
							}
						});
					}else if(scope.step === (scope.steps.length-1)){
						if(config.finishConfirm !== undefined){
							util.modal({
								titulo: "<strong>Confirmação</strong>",
								mensagem: config.finishConfirm,
								type: "fullsize",
								option: "slideleft",
								ButtonText1: "OK",
								callback1: function(){
									finish();
								}
							});
						}else{
							finish();
						}
						form.$setPristine();
					}
				};

				scope.clickPrev = function(){
					if(scope.step > 0){
						if (typeof config.onStepPrev === "function") {
							config.onStepPrev();
						}
						scope.step = scope.step - 1;
						plugins();
						// form.$setPristine();
					}
				};

				function finish(){
					if (typeof config.onFinish === "function") {
						config.onFinish();
					}
				}

				function validaPassos(step) {
					return $q(function (success, error) {
						if (typeof config.steps[step].funcao === "function") {
							config.steps[step].funcao()
							.then(function(retorno){
								success(retorno);
							});
						}else{
							success(true);
						}
					});
				}

				scope.onFinishLoading = function(){
					if (typeof config.steps[scope.step].onInit === "function") {
						config.steps[scope.step].onInit();
					}
				};

				var configFormValid = config;
				configFormValid = angular.extend(configFormValid, {
					formClass: ".step-wizard-validation"
				});
				validaForm(configFormValid);
				plugins();
				return scope;
			}
		};
	}])
	.factory('validaForm', ['$q', '$localStorage', '$http', function($q, $localStorage, $http) {
		return function(config){
            $(config.formClass).each(function(){
                if(config.rules === undefined) config.rules = [];
                config.rules.push({
            		'email': {
	                    required: {
	                        depends: function () {
	                            $(this).val($.trim($(this).val()));
	                            return true;
	                        }
	                    },
	                    customemail: true
	                }
                });

                $(this).validate({
                    success: "valid",
                    submitHandler: function () {
                        return true;
                    },
                    errorClass: "form-error",
                    validClass: "form-success",
                    errorElement: "div",
                    ignore: [],
                    rules: config.rules,
                    messages: config.messages,
                    highlight: function (element, errorClass, validClass) {
                        $(element).closest('.form-control').addClass(errorClass).removeClass(validClass);
                    },
                    unhighlight: function (element, errorClass, validClass) {
                        $(element).closest('.form-control').removeClass(errorClass).addClass(validClass);
                    },
                    errorPlacement: function (error, element) {
                        if (element.hasClass("custom-file") || element.hasClass("checkbox-type") || element.hasClass("language")) {
                            element.closest('.option-group').after(error);
                        }
                        else if (element.is(":radio") || element.is(":checkbox")) {
                            element.closest('.option-group').after(error);
                        }
                        else if (element.parent().hasClass('input-group')) {
                            element.parent().after(error);
                        }
                        else {
                            error.insertAfter(element);
                        }
                    },
                    invalidHandler: function (event, validator) {
                        var errors = validator.numberOfInvalids();
                    }
                });

            });
        };
	}])
	
	
	
	
	
	
	
	
	
	
	
	
	
	;
})();