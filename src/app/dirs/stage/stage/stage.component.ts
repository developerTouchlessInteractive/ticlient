import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Stage, Task } from 'ti-framework'
import { Observable, BehaviorSubject } from 'rxjs';
import { AlertComponent, AlertType } from 'src/app/alert/alert.component';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {
  selectedTasks: Task[] = []
  selectedTask = new FormControl('')
  name = new FormControl('')
  canSkip = new FormControl('')
  hostConsentToProceed = new FormControl('')

  allTasks$: Observable<Task[]>
  allTasksSubject = new BehaviorSubject<Task[]>([])
  selectedTasks$: Observable<Task[]>
  selectedTaskSubject = new BehaviorSubject<Task[]>([])
  allTasks: Task[]

  allStages$: Observable<Stage[]>
  allStagesSubject = new BehaviorSubject<Stage[]>([])
  @ViewChild("alert") alertComp: AlertComponent;

  constructor(private appServ: AppService) { }

  async ngOnInit(): Promise<void> {
    this.allTasks$ = this.allTasksSubject.asObservable()
    this.allStages$ = this.allStagesSubject.asObservable()
    this.selectedTasks$ = this.selectedTaskSubject.asObservable()
    await this.fetchTasks()
    await this.fetchStages()
  }

  async fetchTasks() {
    this.allTasks = await this.appServ.getAllTasks()
    this.allTasks.reverse()
    this.allTasksSubject.next(this.allTasks)
  }

  async fetchStages() {
    const stages = await this.appServ.getAllStages()
    stages.reverse()
    this.allStagesSubject.next(stages)
  }

  async reset() {
    this.selectedTask.setValue(null)
    this.name.setValue("")
    this.selectedTasks = []
    this.selectedTaskSubject.next(this.selectedTasks)
    await this.fetchTasks()
    await this.fetchStages()
  }

  addTask() {
    if (this.selectedTask.value !== "") {
      const task = this.allTasks.find(x => x._id === this.selectedTask.value)
      this.selectedTasks.push(task)
      this.selectedTaskSubject.next(this.selectedTasks)
      this.allTasksSubject.subscribe(all => {
        console.log(`task:${this.selectedTask} `)
        const index = all.findIndex(x => x._id === this.selectedTask.value)
        if (index > -1) {
          all.splice(index, 1);
          console.log(`total number of tasks selected for this stage so far:  ${this.selectedTasks.length}`)
          this.allTasksSubject.next(all)
        }
      })
    }
  }

  async createStage() {
    try {
      console.log('map => ' + JSON.stringify(this.selectedTasks.map(x => x._id)))
      const res = await this.appServ.createStage(this.name.value, this.selectedTasks.map(x => x._id), (this.canSkip.value ? this.canSkip.value : false), (this.hostConsentToProceed.value ? this.hostConsentToProceed.value : false))
      if (res && res.code === 200) {
        console.log(JSON.stringify(res))
        this.showTimedAlert(`succesfully created stage ${this.name.value}`, AlertType.SUCCESS)
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
