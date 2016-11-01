import {Component} from 'angular2/core';
import {CalibratesComponent} from "./calibrates/calibrates.component";
import {EndpointListComponent} from "./routes/endpoint-list.component";
import {ExpressRequestComponent} from "./routes/express-request.component";

@Component({
    selector: 'my-app',
    template: `  
        <h1><i class="fa fa-home" aria-hidden="true"></i> Home Content</h1>
        <br>
        <endpoint-list></endpoint-list>
        <express-request></express-request>
        <calibrates></calibrates>
    `,
    directives: [CalibratesComponent, EndpointListComponent, ExpressRequestComponent]
})
export class AppComponent {

}