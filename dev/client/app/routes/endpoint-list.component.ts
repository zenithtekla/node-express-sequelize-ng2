import {Component, OnInit} from "angular2/core";
import {EndpointsService} from "./endpoints.service";
import {ValuesPipe} from "../assets/pipe.component";

@Component({
  selector: 'endpoint-list',
  template:`
    <div id="endpoint-list">
      <h3 class="text-lg-center">LIST of API endpoints</h3>
      <hr>
      <div *ngFor="#api of apis">
        <span class="float-md-right">{{api.route}}</span>
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