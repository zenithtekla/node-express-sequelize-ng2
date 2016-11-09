import {Component} from "angular2/core";
import {EquipmentListComponent} from "./equipments/equipment-list.component";

@Component({
  selector: 'calibrates',
  template:`
    <h2 class="text-lg-center">Calibrates App</h2>
    <hr>
    <calibrate-list></calibrate-list>
  `,
  directives: [EquipmentListComponent]
})

export class CalibratesComponent {

}