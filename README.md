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
```html
  <wizard wizard-config="vm.wizard" ng-model="vm"></wizard>
...

## Your controller

```html
angular.module('app')<br>
    .controller('yourCtrl', [function(){<br><br>

  vm.wizard = {<br>
              steps: [{<br>
                  templateUrl: 'assets/pages/wizard/step1.html',<br>
                  hasForm: true,<br>
                  title: 'Your title',<br>
                  funcao: function(calback){}<br>
              }],<br>
              messages: {<br>
                  fieldName: { required: '' }<br>
              },<br>
              finishConfirm: "Confirm finish",<br>
              onFinish: function(){}<br>
          };
}]);
...

## Options
```html
  -> steps<br>
    -> templateUrl: String - Path your fragment<br>
    -> hasForm: Boolean - Indicate if has form<br>
    -> title: String - Step description<br>
    -> funcao: Function - Function performed while changing step<br>
    -> onInit: Function - Function started at the start of each step<br><br><br>
    
  -> messages: Descriptions validations<br>
  -> finishConfirm: String - Message confirmation<br>
  -> onFinish: Function - Function performed at the end of the last step<br>
...
