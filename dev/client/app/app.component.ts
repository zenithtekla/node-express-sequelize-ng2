import {Component} from 'angular2/core';
import {CalibratesComponent} from "./calibrates/calibrates.component";

@Component({
    selector: 'my-app',
    template: `  
        <h1>Home Content</h1>
        <calibrates></calibrates>
    `,
    directives: [CalibratesComponent]
})
export class AppComponent {

}