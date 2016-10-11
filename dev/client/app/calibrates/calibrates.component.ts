import {Component} from "angular2/core";
import {EquipmentListComponent} from "./equipments/equipment-list.component";
import {EquipmentListClonedComponent} from "./equipments/equipment-list-cloned.component";

@Component({
  selector: 'calibrates',
  template:`
    <h2>Calibrates App</h2>
    <hr>
    <calibrate-list-cloned></calibrate-list-cloned>
  `,
  directives: [EquipmentListClonedComponent]
})

export class CalibratesComponent {

}