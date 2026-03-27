import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  @Input() hasResult = false;
  @Output() goDashboard = new EventEmitter<void>();

  onGoDashboard() {
    this.goDashboard.emit();
  }
}
