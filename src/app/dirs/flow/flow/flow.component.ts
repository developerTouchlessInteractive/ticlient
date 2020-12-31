import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Stage, Flow } from 'ti-framework'
import { AlertComponent, AlertType } from 'src/app/alert/alert.component';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit {
  selectedStages: Stage[] = []
  readonly selectedStage = new FormControl('')
  readonly name = new FormControl('')
  readonly hostCanAbort = new FormControl('')

  allStages: Stage[] = []
  allstages$: Observable<Stage[]>
  readonly allStagesSubject = new BehaviorSubject<Stage[]>([])

  allflows$: Observable<Flow[]>
  readonly allFlowsSubject = new BehaviorSubject<Flow[]>([])

  selectedStages$: Observable<Stage[]>
  readonly selectedStagesSubject = new BehaviorSubject<Stage[]>([])

  @ViewChild("alert") alertComp: AlertComponent;

  constructor(private appServ: AppService) { }

  async ngOnInit(): Promise<void> {
    this.allstages$ = this.allStagesSubject.asObservable()
    this.allflows$ = this.allFlowsSubject.asObservable()
    this.selectedStages$ = this.selectedStagesSubject.asObservable()

    await this.fetchStages()
    await this.fetchFlows()
  }

  async fetchFlows() {
    const flows: Flow[] = await this.appServ.getAllFlows()
    flows.reverse()
    this.allFlowsSubject.next(flows)
  }

  async fetchStages() {
    const stages = await this.appServ.getAllStages()
    stages.reverse()
    this.allStages = stages
    this.allStagesSubject.next(stages)
  }

  async reset() {
    this.selectedStage.setValue(null)
    this.name.setValue("")
    this.selectedStages = []
    this.selectedStagesSubject.next(this.selectedStages)
    await this.fetchFlows()
    await this.fetchStages()
  }

  addStage() {
    const stage = this.allStages.find(x => x._id === this.selectedStage.value)
    this.selectedStages.push(stage)
    this.selectedStagesSubject.next(this.selectedStages)
    this.allStagesSubject.subscribe(all => {
      console.log(`stage selected for flow:${this.selectedStage} `)
      const index = all.findIndex(x => x._id === this.selectedStage.value)
      if (index > -1) {
        all.splice(index, 1);
        console.log(`total number of stages selected for this flow so far: ${this.selectedStages.length}`)
        this.allStagesSubject.next(all)
      }
    })
  }

  async createFlow() {
    try {
      const res = await this.appServ.createFlow(this.name.value, this.selectedStages.map(x => x._id), (this.hostCanAbort.value ? this.hostCanAbort.value : false))
      if (res && res.code === 617) {
        console.log(JSON.stringify(res))
        this.showTimedAlert(`succesfully created flow ${this.name.value}`, AlertType.SUCCESS)
        await this.reset()
      } else {
        throw new Error(res ? res.code + ' => ' + res.message : "unable create flow");
      }
    } catch (error) {
      console.log('unable to create flow' + error)
      this.alertComp.showMessage(error, AlertType.DANGER)
      await this.reset()
    }
  }

  showTimedAlert = (message: string, type: AlertType) => {
    this.alertComp.showMessage(`succesfully created flow ${this.name.value}`, type)
    setTimeout(() => {
      this.alertComp.close()
    }, 3000);
  }
}
