import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Task } from 'ti-framework'
import { Observable, BehaviorSubject } from 'rxjs';
import { AlertComponent, AlertType } from 'src/app/alert/alert.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  resource = new FormControl('')
  name = new FormControl('')
  controller_name = new FormControl('')
  userinput = new FormControl('')
  useraction = new FormControl('')
  allTasks$: Observable<Task[]>
  allTasksSubject = new BehaviorSubject<Task[]>([])

  @ViewChild("alert") alertComp: AlertComponent;

  constructor(private appServ: AppService) { }

  async ngOnInit() {
    this.allTasks$ = this.allTasksSubject.asObservable()
    await this.fetchTasks()
  }

  async taskSubmit() {
    console.log(`name: ${this.name.value} controller_name: ${this.controller_name.value} resource:${this.resource.value} userinput:${this.userinput.value} useraction:${this.useraction.value}`)
    try {
      const res = await this.appServ.createTask(this.name.value, this.controller_name.value, this.resource.value, this.useraction.value, this.userinput.value);
      if (res && res.code === 600) {
        console.log(JSON.stringify(res))
        this.showTimedAlert(`succesfully created task ${this.name.value}`, AlertType.SUCCESS)
        this.reset()
      } else {
        throw new Error(res ? res.code + ' => ' + res.message : "unable create task");
      }
    } catch (error) {
      console.log('unable to create task' + error)
      this.alertComp.showMessage(error, AlertType.DANGER)
      this.reset()
    }
  }

  async reset() {
    await this.fetchTasks()
    this.name.setValue("")
    this.controller_name.setValue("")
    this.userinput.setValue("")
    this.useraction.setValue("")
    this.resource.setValue("")
  }

  async fetchTasks() {
    try {
      const tasks: Task[] = await this.appServ.getAllTasks()
      tasks.reverse()
      this.allTasksSubject.next(tasks)
    } catch (error) {
      this.alertComp.showMessage("unable to retrieve tasks from server, check if your server is up", AlertType.DANGER)
    }
  }


  showTimedAlert = (message: string, type: AlertType) => {
    this.alertComp.showMessage(`succesfully created flow ${this.name.value}`, type)
    setTimeout(() => {
      this.alertComp.close()
    }, 3000);
  }
}