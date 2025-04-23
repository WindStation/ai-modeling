/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProjectDto } from '../models/CreateProjectDto';
import type { Project } from '../models/Project';
import type { UpdateProjectDto } from '../models/UpdateProjectDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProjectService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns Project OK
     * @throws ApiError
     */
    public updateProject(
        requestBody: UpdateProjectDto,
    ): CancelablePromise<Project> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/project/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Project OK
     * @throws ApiError
     */
    public createProjectForSelf(
        requestBody: CreateProjectDto,
    ): CancelablePromise<Project> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/self/project',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns Project OK
     * @throws ApiError
     */
    public getSelfProjects(): CancelablePromise<Array<Project>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/self/projects',
        });
    }
    /**
     * @param id
     * @returns Project OK
     * @throws ApiError
     */
    public getProject(
        id: number,
    ): CancelablePromise<Project> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/project/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public deleteProject(
        id: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/project/{id}',
            path: {
                'id': id,
            },
        });
    }
}
