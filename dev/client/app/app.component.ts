import {Component} from 'angular2/core';
import {CalibratesComponent} from "./calibrates/calibrates.component";
import {EndpointListComponent} from "./routes/endpoint-list.component";

@Component({
    selector: 'my-app',
    template: `  
        <h1>Home Content</h1>
        <br>
        <endpoint-list></endpoint-list>
        <calibrates></calibrates>
    `,
    directives: [CalibratesComponent, EndpointListComponent]
})
export class AppComponent {

}