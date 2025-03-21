/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppendMessageDto } from '../models/AppendMessageDto';
import type { Chat } from '../models/Chat';
import type { CreateChatDto } from '../models/CreateChatDto';
import type { DeleteChatDto } from '../models/DeleteChatDto';
import type { UpdateChatDto } from '../models/UpdateChatDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ChatService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns Chat OK
     * @throws ApiError
     */
    public appendChatMessage(
        requestBody: AppendMessageDto,
    ): CancelablePromise<Chat> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/chat/append',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Chat OK
     * @throws ApiError
     */
    public updateChat(
        requestBody: UpdateChatDto,
    ): CancelablePromise<Chat> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/chat/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Chat OK
     * @throws ApiError
     */
    public createChat(
        requestBody: CreateChatDto,
    ): CancelablePromise<Chat> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/chat/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns Chat OK
     * @throws ApiError
     */
    public getChatsForUser(
        id: number,
    ): CancelablePromise<Array<Chat>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/chats',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns Chat OK
     * @throws ApiError
     */
    public getChatsForSelf(): CancelablePromise<Array<Chat>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/chats',
        });
    }
    /**
     * @param id
     * @returns Chat OK
     * @throws ApiError
     */
    public getChatForSelfById(
        id: number,
    ): CancelablePromise<Chat> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/chat/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns Chat OK
     * @throws ApiError
     */
    public getChatById(
        id: number,
    ): CancelablePromise<Chat> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/chat/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public deleteChat(
        requestBody: DeleteChatDto,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/chat/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
