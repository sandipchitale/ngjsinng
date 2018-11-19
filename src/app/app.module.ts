import * as angular from 'angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { setAngularJSGlobal, downgradeComponent, UpgradeModule } from '@angular/upgrade/static';
import { AppComponent } from './app.component';
import { CustomPresentationDirective } from './custom-presenation.directive';

interface IModule extends angular.IModule {
  registerController(name: string, dependencyAnnotatedConstructor: any[]): void;
}

angular
  .module('SearchModule', [])
  .config(['$controllerProvider', function ($controllerProvider) {
    (<IModule>angular.module('SearchModule')).registerController = $controllerProvider.register;
  }])
  .directive('appRoot', downgradeComponent({component: AppComponent}))
  .factory('TwoWayService', function() {
    return {
      getMessage: function() {
        return 'From TwoWayService @ ' + new Date();
      },
      showMessage: function(message) {
        console.log(message);
      }
    };
  })
  .component('customPresentation', {
    template: `
    <div ng-controller="CustomPresenatationCtrl as vm">
      <textarea rows="20" cols="140" ng-model="vm.customPresentation" style="font-family: Courier New;"></textarea>
      <br/>
      <button ng-click="vm.load()">Load custom presentation</button>
      <div id="customPresentation"></div>
    </div>
    `
  })
  .controller('CustomPresenatationCtrl', ['$document', '$scope', '$compile', '$element', function($document, $scope, $compile, $element) {
    var vm = this;
    vm.customPresentation =
        ''
      + '<script>\n'
      + 'angular\n'
      + '.module(\'SearchModule\')\n'
      + '.registerController(\'CustomerCustomPresentationCtrl\', [\'TwoWayService\', \'$timeout\', function(TwoWayService, $timeout) {\n'
      + '  var vm = this;\n'
      + '  vm.message = TwoWayService.getMessage();\n'
      + '  TwoWayService.showMessage(vm.message);\n'
      + '}]);\n'
      + '</script>\n'
      + '<div ng-controller="CustomerCustomPresentationCtrl as vm">{{vm.message}}</div>\n'
      ;

    vm.load = function() {
      var fragment = $document[0].createRange().createContextualFragment(vm.customPresentation);
      $element.find('div').empty();
      $element.find('div').append(fragment);
      $compile($element.find('div').contents())($scope);
    };
  }])
  ;

@NgModule({
  imports:         [ BrowserModule, UpgradeModule ],
  declarations:    [ AppComponent, CustomPresentationDirective ],
  entryComponents: [ AppComponent ],
  providers: [
    {provide: 'Document', useValue: 'document'}
  ]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}

  ngDoBootstrap() {
    setAngularJSGlobal(angular);
    this.upgrade.bootstrap(document.body, ['SearchModule']);
  }
}
