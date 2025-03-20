/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from '../models/Message';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MessageService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param id
     * @returns Message OK
     * @throws ApiError
     */
    public getChatMessages(
        id: number,
    ): CancelablePromise<Array<Message>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/chat/{id}/messages',
            path: {
                'id': id,
            },
        });
    }
}
