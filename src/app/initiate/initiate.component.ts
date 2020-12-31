import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Flow, comm_events, CommunicationData, ResponseData } from 'ti-framework'
import { Observable, BehaviorSubject } from 'rxjs';
import { AlertComponent, AlertType } from '../alert/alert.component';
import { AppService } from '../app.service';
import { DatadisplayComponent } from '../datadisplay/datadisplay.component';
import * as moment from 'moment'
import { Router } from '@angular/router';
import { ClientFlowListener } from './flow.listener';

@Component({
  selector: 'app-initiate',
  templateUrl: './initiate.component.html',
  styleUrls: ['./initiate.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class InitiateComponent implements OnInit {
  flowInitiated: boolean = true
  communicationdata
  showFlowList = true
  inviteCode
  sessionData
  private _flowId;
  public get flowId() {
    return this._flowId;
  }
  public set flowId(value) {
    if (!value && value === "") throw new Error("emty flow id.");

    this._flowId = value;
  }
  @ViewChild("alert") alertComp: AlertComponent;
  @ViewChild("dataalert") dataAlertComp: DatadisplayComponent;
  @ViewChild('content', { static: false }) private modal;

  allflows$: Observable<Flow[]>
  allFlowsSubject = new BehaviorSubject<Flow[]>([])
  flows
  events: ResponseData[] = []
  commDatas: CommunicationData[] = [];

  message = ""
  constructor(private appServ: AppService, config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    this.allflows$ = this.allFlowsSubject.asObservable()
    this.flows = await this.appServ.getAllFlows()
    this.allFlowsSubject.next(this.flows)
  }

  open(content) {
    this.modalService.open(content);
  }

  flowCompleted() {
    this.flowInitiated = false
    this.commDatas = []
    this.events = []
    this.open(this.modal)
  }

  goHome() {
    this.modalService.dismissAll()
    this.router.navigate(["task"])
  }

  async startFlow(id) {
    this._flowId = id
    const res = await this.appServ.startFlow(id, new ClientFlowListener(this))

    this.appServ.commdata$.subscribe((data: CommunicationData) => {
      this.communicationdata = data
      if (!this.doesPacketExist(data)) this.commDatas.push(data)
      this.dataAlertComp.show()
      setTimeout(() => {
        this.dataAlertComp.close()
      }, 3000);
    })
  }

  /**
   * check if packet is already displayed
   * in the current communication data list
   * @param data CommunicationData
   */
  doesPacketExist(data: CommunicationData | ResponseData) {
    const currentPackets = this.commDatas.filter(x => x.packetId === data.packetId)
    return currentPackets.length > 0
  }

  async VerifyAndCloseSession() {
    if (await this.appServ.completeFlow(this.sessionData.sessionId)) {
      this.commDatas = []
      this.showFlowList = true
      this.alertComp.showMessage("Flow Completed", AlertType.SUCCESS)
    } else {
      this.alertComp.showMessage("Unable to Complete Flow", AlertType.DANGER)
    }
  }

  getEventType(event) {
    return `${event.type?.type} `
  }

  getTaskName(event) {
    return `${event.type?.data?.taskState?.controllerName} `
  }

  getTaskResource(event) {
    return `${event.type?.data?.taskState?.resource} `
  }

  getDataType(type) {
    return comm_events[type]
  }

  getMomentTime(time) {
    return moment(time).format('MMMM Do , h:mm:ss a')
  }

  async sendMessage() {
    console.log(`message ${this.message}`)
    const data = await this.appServ.broadcastMessage(this.message)
    if (!this.doesPacketExist(data)) this.commDatas.push(data)
    if (data.packetId) {
      this.alertComp.showMessage("Message Sent!", AlertType.SUCCESS)
      this.message = ""
      setTimeout(() => {
        this.alertComp.close()
      }, 2000);
    }
  }
}