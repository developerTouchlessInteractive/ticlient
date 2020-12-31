
import { Injectable } from '@angular/core';
import * as ti from 'ti-framework'
import { CommunicationData, EndPoint } from 'ti-framework';
import { Observable, Subject } from 'rxjs';
import { ClientDataInterface } from './initiate/interaction.listener';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _commDatas: CommunicationData[] = [];
  commdata$: Observable<CommunicationData>
  communicationDataSubject = new Subject<CommunicationData>()
  private dataInterface: ClientDataInterface

  sessionId: any;

  constructor() {
    this.setEnv(ti.local_serverUrl, ti.EnvType.DEBUG, ti.interact_local_serverUrl)
    this.commdata$ = this.communicationDataSubject.asObservable()
    this.commdata$.subscribe(data => this._commDatas.push(data))
  }

  /**
   * sets server URL(eg: a localhost or remote) 
   * @param url 
   * @param env 
   */
  setEnv(serverurl, env, interacturl) {
    const serverConfig: ti.ServerConfig = {
      serverUrl: serverurl,
      envType: env,
      interactServerUrl: interacturl
    }
    try {
      ti.setServerEndpoint(serverConfig)
    } catch (error) {
      console.log('unable to set server url ' + JSON.stringify(error, null, 2))
    }

  }
  getAllTasks(): Promise<ti.Task[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const tasks: ti.Task[] = await ti.titask.getAllTasks()
        resolve(tasks)
      } catch (error) {
        console.log('error while resolving promise' + JSON.stringify(error))
        reject(error)
      }
    })
  }

  getAllStages() {
    return ti.tistage.getAllStages()
  }

  getAllFlows() {
    return ti.tiflow.getAllFlows()
  }


  public getCommDataHistory() {
    return this._commDatas
  }

  async createTask(name, controller_name, resource, action, input) {
    return await ti.titask.createTask(name, controller_name, resource, action, input)
  }


  async createStage(name, tasks, canSkip, hostconsent) {
    return await ti.tistage.createStage(name, tasks, canSkip, hostconsent)
  }

  async createFlow(name, stages, hostCanAbort) {
    return await ti.tiflow.createFlow(name, stages, hostCanAbort)
  }

  async startFlow(idFlow: string, listener) {
    ti.startFlow(idFlow, listener)
      .then(async started => {
        //also initiating interact session
        if (started) {
          await this.startInteraction(started.sessionId)
        }
      })
      .catch(error => {
        console.log('err' + JSON.stringify(error))
      })


  }

  completeFlow(sessionId: string) {
    return ti.finishFlow(sessionId)
  }

  clearFlow() {
    this._commDatas = []
  }

  async startInteraction(sessionId) {
    try {
      this.sessionId = sessionId
      this.dataInterface = new ClientDataInterface(this.communicationDataSubject)
      await ti.startInteraction(sessionId, EndPoint.CLIENT, this.dataInterface)
    } catch (error) {
      console.log(`error starting interaction ${JSON.stringify(error)}`)
    }
  }

  async broadcastMessage(data) {
    return new Promise<CommunicationData>(async (resolve, reject) => {
      try {
        if (this.dataInterface.hasInteractionStarted()) {
          const communicationData: CommunicationData = await ti.util.getCommunicationData(data, this.sessionId)
          await ti.sendInteractionData(this.sessionId, communicationData)
          resolve(communicationData)
        } else {
          reject()
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}
