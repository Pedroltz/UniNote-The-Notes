import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent {

  @Input() name: string = '';
  @Input() size: number = 16; 
  @Input() href: string = ''; 
  @Input() backgroundColor: string = '';
  @Input() color: string = '';
  @Input() borderColor: string = '';

}
