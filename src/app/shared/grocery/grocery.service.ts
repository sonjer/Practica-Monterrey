import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Config } from "../config";
import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
    baseUrl = Config.apiUrl + "appdata/" + Config.appKey + "/Groceries";

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
                let groceryList = [];
                data.forEach((grocery) => {
                    groceryList.push(new Grocery((<any>grocery)._id, (<any>grocery).Name));
                });
                return groceryList;
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

    add(name: string) {
        return this.http.post(
            this.baseUrl,
            JSON.stringify({ Name: name }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(data => {
                return new Grocery((<any>data)._id, name);
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
