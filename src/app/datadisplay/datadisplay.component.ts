import { Component, Input, OnInit } from '@angular/core';
import { CommunicationData } from 'ti-framework';
import * as moment from 'moment'

@Component({
  selector: 'data-display',
  templateUrl: './datadisplay.component.html',
  styleUrls: ['./datadisplay.component.scss']
})
export class DatadisplayComponent implements OnInit {
  showData = false
  @Input() data: CommunicationData
  message = ""
  type = ""
  time = ""

  constructor() { }

  ngOnInit(): void { }


  close() {
    this.showData = false
  }

  show() {
    if (this.data) {
      this.showData = true
      this.type = JSON.stringify(this.data.type)
      this.time = moment(this.data.time).format('MMMM Do , h:mm a');
      this.message = `data: ${this.data.data}`
    }
  }
}
