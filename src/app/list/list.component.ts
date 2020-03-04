import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { Task } from "../shared/tarea/tarea.model";
import { TaskService } from "../shared/tarea/tarea.service";
import { TextField } from "tns-core-modules/ui/text-field";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";

@Component({
    selector: "gr-list",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    providers: [TaskService]
})
export class ListComponent implements OnInit {
    taskList: Array<Task> = [];
    tarea = "";
    isLoading = false;
    listLoaded = false;
    @ViewChild("tareaTextField", { static: false }) tareaTextField: ElementRef;
    constructor(private taskService: TaskService) {}

    ngOnInit() {
        this.isLoading = true;
        this.taskService.load()
            .subscribe((loadedGroceries: []) => {
                loadedGroceries.forEach((tareaObject) => {
                    this.taskList.unshift(tareaObject);
                    console.log("OnInit",this.taskList);
                });
                this.isLoading = false;
                this.listLoaded = true;
            });
    }

    add() {
        if (this.tarea.trim() === "") {
            alert("Enter a tarea item");
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.tareaTextField.nativeElement;
        textField.dismissSoftInput();

        this.taskService.add(this.tarea)
            .subscribe(
                (tareaObject: Task) => {
                    this.taskList.unshift(tareaObject);
                    this.tarea = "";
                },
                () => {
                    alert({
                        message: "An error occurred while adding an item to your list.",
                        okButtonText: "OK"
                    });
                    this.tarea = "";
                }
            )
    }

    onSwipeCellStarted(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args.object;
        var rightItem = swipeView.getViewById<View>("delete-view");
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.left = 0;
        swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
    }

    delete(args: ListViewEventData) {
        let tarea = <Task>args.object.bindingContext;
        this.taskService.delete(tarea.id)
            .subscribe(() => {
                let index = this.taskList.indexOf(tarea);
                this.taskList.splice(index, 1);
            });
    }
}
