import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { Tarea } from "../shared/tarea/tarea.model";
import { TareaService } from "../shared/tarea/tarea.service";
import { TextField } from "tns-core-modules/ui/text-field";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";

@Component({
    selector: "gr-list",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    providers: [TareaService]
})
export class ListComponent implements OnInit {
    tareaList: Array<Tarea> = [];
    tarea = "";
    isLoading = false;
    listLoaded = false;
    @ViewChild("tareaTextField", { static: false }) tareaTextField: ElementRef;
    constructor(private tareaService: TareaService) {}

    ngOnInit() {
        this.isLoading = true;
        this.tareaService.load()
            .subscribe((loadedGroceries: []) => {
                loadedGroceries.forEach((tareaObject) => {
                    this.tareaList.unshift(tareaObject);
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

        this.tareaService.add(this.tarea)
            .subscribe(
                (tareaObject: Tarea) => {
                    this.tareaList.unshift(tareaObject);
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
        let tarea = <Tarea>args.object.bindingContext;
        this.tareaService.delete(tarea.id)
            .subscribe(() => {
                let index = this.tareaList.indexOf(tarea);
                this.tareaList.splice(index, 1);
            });
    }
}
