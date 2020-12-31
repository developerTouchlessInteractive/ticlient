import { CommunicationData } from "ti-framework"
import * as ti from 'ti-framework'

export class ClientDataInterface implements ti.DataInterface {
    subject

    private interactionStarted = false

    constructor(cb) {
        this.subject = cb
    }

    hasInteractionStarted() {
        return this.interactionStarted
    }


    receiveData(data: CommunicationData): void {
        console.log(`rece inf: ${JSON.stringify(data)}`)
        this.subject.next(data)
    }
    interactionConnected(data?: any) {
        this.interactionStarted = true
    }
    interactionDisConnected(data?: any) {
        console.log(`con disc: ${JSON.stringify(data)}`)
    }
    connectionUpdate(data?: any) {
        console.log(`con update: ${JSON.stringify(data)}`)
    }
}