import {Injectable} from "angular2/core";
import {Http, Headers, Response, RequestMethod, Request, RequestOptions} from "angular2/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Rx";

@Injectable()
export class EquipmentRestfulService {
  constructor(private _http: Http) {}

  getEquipmentList() {
    return this._http.get('http://localhost:3000/equipment')
      .map(res => res.json())
      .catch(this.handleError);
  }

  postEquipment(){
    let uri1 = 'http://esp21:4000/equipment/brts31/',
        uri2= 'http://validate.jsontest.com/',
        raw = JSON.stringify({ asset_number: 99999, desc: "3119"}),
        body = 'asset_number=99999&desc=3119';

    let json = '?json=' + JSON.stringify({ var1: 'test', var2: 3});
    let headers = new Headers({'Content-Type': 'application/json'});
    // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: uri1,
      headers: headers,
      body: raw
    });

    return this._http.request(new Request(requestoptions))
      .map((res: Response) => {
        if (res) {
          return [{ status: res.status, json: res.json() }]
        }
      });

    /*return this._http.post(uri1, raw)
      .map(res => res.json())
      .catch(this.handleError);*/
  }

  private handleError (error : Response){
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}