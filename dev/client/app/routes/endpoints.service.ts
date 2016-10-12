import {Injectable} from "angular2/core";
import {Http, Headers, Response, RequestMethod, Request, RequestOptions} from "angular2/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Rx";

@Injectable()
export class EndpointsService {
  constructor(private _http: Http) {}

  getEndpointList() {
    return this._http.get('/json/routeConfig.json')
      .map(res => res.json())
      .catch(this.handleError);
  }

  private PostRequest(url, data){
    let headers = new Headers({'Content-Type': 'application/json'});
    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: JSON.stringify(data)
    });

    return this._http.request(new Request(requestoptions))
      .map((res: Response) => {
        if (res) {
          return [{ status: res.status, json: res.json() }]
        }
      })
      .catch(this.handleError);
  }

  private handleError (error : Response){
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}