import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Config } from "../config";
import { Task } from "./tarea.model";

@Injectable()
export class TaskService {
    baseUrl = Config.apiUrl ;

    constructor(private http: HttpClient) { }

    load() {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
        let params = {
            "sort": "{\"_kmd.lmt\": 1}"
        }

        return this.http.get(this.baseUrl, {
            headers: this.getCommonHeaders(),
            params: params
        }).pipe(
            map((data: []) => {
                let taskList = [];
                data.forEach((tarea) => {
                    taskList.push(new Task((<any>tarea)._id, (<any>tarea).title));
                });
                console.log("load tarea",taskList);
                return taskList;
            }),
            catchError(this.handleErrors)
        );
    }

    getCommonHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": "Kinvey " + Config.token
        }
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error));
        return throwError(error);
    }

    add(title: string) {
        return this.http.post(
            this.baseUrl,
            JSON.stringify({ title: title }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(data => {
                console.log("data",data);
                return new Task((<any>data)._id, title);
            }),
            catchError(this.handleErrors)
        );
    }

    delete(id: string) {
        return this.http.delete(
            this.baseUrl + "/" + id,
            { headers: this.getCommonHeaders() } 
        ).pipe(
            catchError (this.handleErrors)
        );
    }
}
