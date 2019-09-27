import { Directive, HostListener, ElementRef } from '@angular/core';
@Directive({
    selector: '[appLowerCase]'
})
export class TolowerCaseDirective {

    constructor(
        private el: ElementRef
    ) {}

    @HostListener('keyup') onKeyUp() {
        this.el.nativeElement.value = this.el.nativeElement.value.toLowerCase();
    }
}
