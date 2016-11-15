import {Component, OnInit} from "angular2/core";
import {EquipmentRestfulService} from "../services/restful.service";

@Component({
  selector: 'calibrate-list-cloned',
  template:`
    <h3>my calibrate list</h3>
    <button (click) = "onGetEquipment()">GET Equipments</button>
    <p> Output: {{calibrate_json}}</p>
    <hr>
    <table class="table table-striped">
      <thead class="thead-inverse">
        <tr>
          <th>Actions</th>
          <th>Asset Number</th>
          <th>Model</th>
          <th>Location</th>
          <th>Last Cal</th>
          <th>Next Cal</th>
          <th>File</th>
        </tr>
      </thead>
      <tbody *ngFor="#calibrate of calibrates">
      <tr>
        <td>Some Actions</td>
        <td>{{calibrate.asset_number}}</td>
        <td>{{calibrate.model}}</td>
        <td>{{calibrate.ECMS_Location.desc}}</td>
        <td>{{calibrate.ECMS_Dossiers[0].last_cal}}</td>
        <td>{{calibrate.ECMS_Dossiers[0].next_cal}}</td>
        <td>{{calibrate.ECMS_Dossiers[0].file}}</td>
      </tr>
      </tbody>
    </table>
    <button (click) = "onPostEquipment()">Create an Equipment</button>
    <p> Output: {{postData}}</p>
  `,
  providers: [EquipmentRestfulService]
})

export class EquipmentListClonedComponent {
  calibrate_json: string;
  postData: string;
  calibrates: any;
/*  calibrates: any;
  constructor(public http: Http) { }

  ngOnInit(){
    this.http.get('http://localhost:3000/table_calibrate').map(response => this.calibrates = response.json().data);
  }*/
  constructor (private _httpService: EquipmentRestfulService) {}

  onGetEquipment(){
    this._httpService.getEquipmentList()
      .subscribe(
        data => {
          this.calibrate_json = JSON.stringify(data);
          this.calibrates = data.calibrates;
        },
        error => alert(error),
        ()  => console.log('Finished getEquipmentList')
      );
  }

  onPostEquipment(){
    this._httpService.postEquipment()
      .subscribe(
        data => this.postData = JSON.stringify(data),
        error => alert(error),
        ()  => console.log('Finished onPostEquipment')
      );
  }
}