import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateMask]'
})
export class DateMaskDirective {
  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    const value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value.length <= 2) {
      input.value = value;
    } else if (value.length <= 4) {
      input.value = `${value.substring(0, 2)}/${value.substring(2)}`;
    } else {
      input.value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4, 8)}`;
    }
  }
}
