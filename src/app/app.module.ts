import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TaskComponent } from './dirs/task/task/task.component';
import { StageComponent } from './dirs/stage/stage/stage.component';
import { FlowComponent } from './dirs/flow/flow/flow.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { InitiateComponent } from './initiate/initiate.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DatadisplayComponent } from './datadisplay/datadisplay.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    StageComponent,
    FlowComponent,
    AlertComponent,
    InitiateComponent,
    NavbarComponent,
    DatadisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule { }
