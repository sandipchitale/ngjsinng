import { UpgradeComponent } from '@angular/upgrade/static';
import { ElementRef, Injector, Directive } from '@angular/core';

@Directive({
  selector: 'custom-presentation'
})
export class CustomPresentationDirective extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {
    super('customPresentation', elementRef, injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}