import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { Grocery } from "../shared/grocery/grocery.model";
import { GroceryService } from "../shared/grocery/grocery.service";
import { TextField } from "tns-core-modules/ui/text-field";

@Component({
    selector: "gr-list",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    providers: [GroceryService]
})
export class ListComponent implements OnInit {
    groceryList: Array<Grocery> = [];
    grocery = "";
    @ViewChild("groceryTextField", { static: false }) groceryTextField: ElementRef;
    constructor(private groceryService: GroceryService) {}

    ngOnInit() {
        this.groceryService.load()
            .subscribe((loadedGroceries: []) => {
                loadedGroceries.forEach((groceryObject: Grocery) => {
                    this.groceryList.unshift(groceryObject);
                });
            });
    }

    add() {
        if (this.grocery.trim() === "") {
            alert("Enter a grocery item");
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.groceryTextField.nativeElement;
        textField.dismissSoftInput();

        this.groceryService.add(this.grocery)
            .subscribe(
                (groceryObject: Grocery) => {
                    this.groceryList.unshift(groceryObject);
                    this.grocery = "";
                },
                () => {
                    alert({
                        message: "An error occurred while adding an item to your list.",
                        okButtonText: "OK"
                    });
                    this.grocery = "";
                }
            )
    }
}
