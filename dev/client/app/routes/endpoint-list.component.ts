import {Component, OnInit} from "angular2/core";
import {EndpointsService} from "./endpoints.service";
import {ValuesPipe} from "../assets/pipe.component";

@Component({
  selector: 'endpoint-list',
  template:`
    <div id="endpoint-list">
      <h4>LIST of API endpoints</h4>
      <hr>
      <div *ngFor="#api of apis">
        <span>{{api.route}}</span>
        <table class="table table-striped">
          <thead class="thead-inverse">
            <tr>
              <th>Title</th>
              <th>Route</th>
            </tr>
          </thead>
          <tbody *ngFor="#endpoint of api.endpoints[0] | keys">
            <tr>
              <td>{{endpoint.key}}</td>
              <td>{{endpoint.value}}</td>
            <tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  pipes: [ValuesPipe],
  providers: [EndpointsService]
})

export class EndpointListComponent implements OnInit {
  apis: any;

  constructor (private _httpService: EndpointsService) {}

  ngOnInit(){
    this._httpService.getEndpointList()
      .subscribe(
        data => this.apis = data,
        error => alert(error),
        () => console.log('Finished endpoint-list')
      )
  }
}