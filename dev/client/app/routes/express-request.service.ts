import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Rx";

@Injectable()
export class ExpressRequestService {
  constructor(private _http:Http) {
  }

  getEndpointList() {
    return this._http.get('/json/lastExpressRequest.json')
      .map(res => res.json())
      .catch(this.handleError);
  }

  private handleError (error : Response){
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}