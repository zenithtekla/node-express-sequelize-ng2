import {Injectable} from "angular2/core";
import {Http, Headers, Response, RequestMethod, Request, RequestOptions} from "angular2/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Rx";

@Injectable()
export class EquipmentRestfulService {
  constructor(private _http: Http) {}

  getEquipmentList() {
    return this._http.get('/equipment')
      .map(res => res.json())
      .catch(this.handleError);
  }

  postEquipment(){
    let uri1 = '/equipment/brts31/',
        data = { asset_number: 99999, desc: "3119"};

    return this.PostRequest(uri1,data);
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