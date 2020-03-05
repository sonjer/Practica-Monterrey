import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { Task } from "../shared/task/task.model";
import { TaskService } from "../shared/task/task.service";
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

    taskList: Task[] = [];
    task:string = "";
    isLoading:boolean = false;
    listLoaded:boolean = false;

    @ViewChild("taskTextField", { static: false }) taskTextField: ElementRef;
    constructor(private taskService: TaskService) {}

    ngOnInit() {
        this.isLoading = true;
        this.taskService.loadTask()
            .subscribe((loadedTasks: Task[]) => {
                loadedTasks.forEach((taskObject) => {
                    this.taskList.unshift(taskObject);
                    console.log("OnInit",this.taskList);
                });
                this.isLoading = false;
                this.listLoaded = true;
            });
    }

    addTask() {
        if (this.task.trim() === "") {
            alert("Enter a task item");
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.taskTextField.nativeElement;
        textField.dismissSoftInput();

        this.taskService.addTask(this.task)
            .subscribe(
                (taskObject: Task) => {
                    this.taskList.unshift(taskObject);
                    this.task = "";
                },
                () => {
                    alert({
                        message: "An error occurred while adding an item to your list.",
                        okButtonText: "OK"
                    });
                    this.task = "";
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

    deleteTask(args: ListViewEventData) {
        let task = <Task>args.object.bindingContext;
        this.taskService.deleteTask(task.id)
            .subscribe(() => {
                let index = this.taskList.indexOf(task);
                this.taskList.splice(index, 1);
                alert(" item deleted");
            });
    }
}
