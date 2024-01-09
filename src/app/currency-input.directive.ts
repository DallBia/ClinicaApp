import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]'
})
export class CurrencyInputDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const inputVal = event.target.value;

    let value = inputVal.replace(',', '.');
    value = value.replace(/[^\d.]+/g, '').replace(/(\..*)\./g, '$1');

    value = 'R$ ' + value;


    this.renderer.setProperty(this.el.nativeElement, 'value', value);
  }
}
