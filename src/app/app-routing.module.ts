import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowComponent } from './dirs/flow/flow/flow.component';
import { StageComponent } from './dirs/stage/stage/stage.component';
import { TaskComponent } from './dirs/task/task/task.component';
import { InitiateComponent } from './initiate/initiate.component';


const routes: Routes = [
  { path: 'task', component: TaskComponent },
  { path: 'stage', component: StageComponent },
  { path: 'flow', component: FlowComponent },
  { path: 'initiate', component: InitiateComponent },
  { path: '', redirectTo: '/task', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
