# EASY-WIZARD


## Installation
In a NPM:
```html
npm i angular-easy-wizard
```

In a bower:
```html
bower i --save easy-wizard
```
## Usage

## Add in your HTML page:
  <wizard wizard-config="vm.wizard" ng-model="vm"></wizard>

## Your controller

angular.module('app')
    .controller('yourCtrl', [function(){

  vm.wizard = {
              steps: [{
                  templateUrl: 'assets/pages/wizard/step1.html',
                  hasForm: true,
                  title: 'Your title',
                  funcao: function(calback){}
              }],
              messages: {
                  fieldName: { required: '' }
              },
              finishConfirm: "Confirm finish",
              onFinish: function(){}
          };
}]);

## Options
  -> steps
    -> templateUrl: String - Path your fragment
    -> hasForm: Boolean - Indicate if has form
    -> title: String - Step description
    -> funcao: Function - Function performed while changing step
    -> onInit: Function - Function started at the start of each step
    
  -> messages: Descriptions validations
  -> finishConfirm: String - Message confirmation
  -> onFinish: Function - Function performed at the end of the last step
              
