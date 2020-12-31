import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

export enum AlertType {
  SUCCESS = "success",
  DANGER = "danger"
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() alertMessage
  @Input() alert
  @Input() alertType

  close() {
    this.alert = false
  }

  show() {
    this.alert = true
  }

  showMessage(message: String, alertType: AlertType) {
    this.alertMessage = message
    this.alertType = alertType
    this.alert = true
  }
}
