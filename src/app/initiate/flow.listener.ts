import { ResponseData, ServerEvent } from 'ti-framework'
import * as ti from 'ti-framework'
import { AlertType } from '../alert/alert.component'


export class ClientFlowListener implements ti.FlowListener {
    ctx
    constructor(ctx) {
        this.ctx = ctx
    }

    taskUpdate(event?: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve()
            } catch (error) {
                console.log('error while resolving promise' + JSON.stringify(error))
                reject(error)
            }
        })
    }

    flowConnected(event?: ResponseData): void {
        this.ctx.alertComp.showMessage("Flow is initiated!", AlertType.SUCCESS)
        this.ctx.showFlowList = false
        setTimeout(() => {
            this.ctx.alertComp.close()
        }, 2000);
    }

    flowDisconnected(event?: ResponseData): void {
        console.log("flow is disconnected")
    }

    taskIsComplete(event?: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve()
            } catch (error) {
                console.log('error while resolving promise' + JSON.stringify(error))
                reject(error)
            }
        })

    }

    stageIsComplete(event?: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ctx.alertComp.showMessage("Stage is Complete!", AlertType.SUCCESS)
                resolve()
            } catch (error) {
                console.log('error while resolving promise' + JSON.stringify(error))
                reject(error)
            }
        })
    }

    flowIsComplete(event?: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ctx.flowCompleted()
                resolve()
            } catch (error) {
                console.log('error while resolving promise' + JSON.stringify(error))
                reject(error)
            }
        })
    }
    flowUpdate(event: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (event.type === ServerEvent.ACK_CONNECTION) {
                    this.ctx.alertComp.showMessage("Flow is being initiated!", AlertType.SUCCESS)
                }
                if (event.type === ServerEvent.SESSION_INFO) {
                    this.ctx.sessionData = event.data
                    if (event.data.inviteCode) this.ctx.inviteCode = event.data.inviteCode
                    const ind = this.ctx.events.find(x => x.type === ServerEvent.SESSION_INFO)
                    if (!ind || ind === -1) {
                        this.ctx.events.push(event)
                    }
                } else {
                    this.ctx.events.push(event)
                }

                resolve()
            } catch (error) {
                console.log('error while resolving promise' + JSON.stringify(error))
                reject(error)
            }
        })

    }
    flowCompleted(event: ResponseData) {
        console.log('flow complete')
        this.ctx.events.push(event)
    }
    flowOperationError(event: ResponseData) {
        this.ctx.alertComp.showMessage("Unable to handle flow, check logs for error!", AlertType.DANGER)
        this.ctx.events.push(event)
    }
    flowExitedWithError(event: ResponseData) {
        this.ctx.events.push(event)
    }
}