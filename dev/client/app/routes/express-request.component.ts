import {Component, OnInit} from "angular2/core";
import {ValuesPipe} from "../assets/pipe.component";
import {ExpressRequestService} from "./express-request.service";

@Component({
  selector: 'express-request',
  template:`
    <div id="express-request">
      <h4 class="text-lg-center">Last Express Request</h4>
      <div class="row">
        <p class="text-sm-right">Content from lastExpressRequest.json file</p>
        <table class="table">
          <thead class="thead-inverse">
            <tr>
              <th>Keys</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody *ngFor="#item of items | keys">
            <tr>
              <td>{{item.key}}</td>
              <td>{{item.value | json}}</td>
            <tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  pipes: [ValuesPipe],
  providers: [ExpressRequestService]
})

export class ExpressRequestComponent implements OnInit {
  items: any;

  constructor (private _httpService: ExpressRequestService) {}

  ngOnInit(){
    this._httpService.getEndpointList()
      .subscribe(
        data => this.items = data,
        error => alert(error),
        () => console.log('Finished express-request-list')
      )
  }
}