(function() {
  var myCoffeeFn;

  myCoffeeFn = function() {
    return 'enjoy coffee scripting';
  };

}).call(this);

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("calibrates/services/restful.service", ["angular2/core", "angular2/http", 'rxjs/add/operator/map', "rxjs/Rx"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, http_1, Rx_1;
    var EquipmentRestfulService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            EquipmentRestfulService = (function () {
                function EquipmentRestfulService(_http) {
                    this._http = _http;
                }
                EquipmentRestfulService.prototype.getEquipmentList = function () {
                    return this._http.get('http://localhost:3000/equipment')
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                EquipmentRestfulService.prototype.postEquipment = function () {
                    var uri1 = 'http://localhost:3000/equipment/brts31/', data = { asset_number: 99999, desc: "3119" };
                    return this.PostRequest(uri1, data);
                };
                EquipmentRestfulService.prototype.PostRequest = function (url, data) {
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var requestoptions = new http_1.RequestOptions({
                        method: http_1.RequestMethod.Post,
                        url: url,
                        headers: headers,
                        body: JSON.stringify(data)
                    });
                    return this._http.request(new http_1.Request(requestoptions))
                        .map(function (res) {
                        if (res) {
                            return [{ status: res.status, json: res.json() }];
                        }
                    })
                        .catch(this.handleError);
                };
                EquipmentRestfulService.prototype.handleError = function (error) {
                    console.error(error);
                    return Rx_1.Observable.throw(error.json().error || 'Server error');
                };
                EquipmentRestfulService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], EquipmentRestfulService);
                return EquipmentRestfulService;
            }());
            exports_1("EquipmentRestfulService", EquipmentRestfulService);
        }
    }
});
System.register("calibrates/equipments/equipment-list.component", ["angular2/core", "calibrates/services/restful.service"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_2, restful_service_1;
    var EquipmentListComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (restful_service_1_1) {
                restful_service_1 = restful_service_1_1;
            }],
        execute: function() {
            EquipmentListComponent = (function () {
                /*  calibrates: any;
                  constructor(public http: Http) { }
                
                  ngOnInit(){
                    this.http.get('http://localhost:3000/table_calibrate').map(response => this.calibrates = response.json().data);
                  }*/
                function EquipmentListComponent(_httpService) {
                    this._httpService = _httpService;
                }
                EquipmentListComponent.prototype.onGetEquipment = function () {
                    var _this = this;
                    this._httpService.getEquipmentList()
                        .subscribe(function (data) {
                        _this.calibrate_json = JSON.stringify(data);
                        _this.calibrates = data.calibrates;
                    }, function (error) { return alert(error); }, function () { return console.log('Finished'); });
                };
                EquipmentListComponent.prototype.onPostEquipment = function () {
                    var _this = this;
                    this._httpService.postEquipment()
                        .subscribe(function (data) { return _this.postData = JSON.stringify(data); }, function (error) { return alert(error); }, function () { return console.log('Finished'); });
                };
                EquipmentListComponent = __decorate([
                    core_2.Component({
                        selector: 'calibrate-list',
                        template: "\n    <h3>my calibrate list</h3>\n    <button (click) = \"onGetEquipment()\">GET Equipments</button>\n    <p> Output: {{calibrate_json}}</p>\n    <hr>\n    <table class=\"table table-striped\">\n      <thead class=\"thead-inverse\">\n        <tr>\n          <th>Actions</th>\n          <th>Asset Number</th>\n          <th>Model</th>\n          <th>Location</th>\n          <th>Last Cal</th>\n          <th>Next Cal</th>\n          <th>File</th>\n        </tr>\n      </thead>\n      <tbody *ngFor=\"#calibrate of calibrates\">\n      <tr>\n        <td>Some Actions</td>\n        <td>{{calibrate.asset_number}}</td>\n        <td>{{calibrate.model}}</td>\n        <td>{{calibrate.ECMS_Location.desc}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].last_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].next_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].file}}</td>\n      </tr>\n      </tbody>\n    </table>\n    <button (click) = \"onPostEquipment()\">Create an Equipment</button>\n    <p> Output: {{postData}}</p>\n  ",
                        providers: [restful_service_1.EquipmentRestfulService]
                    }), 
                    __metadata('design:paramtypes', [restful_service_1.EquipmentRestfulService])
                ], EquipmentListComponent);
                return EquipmentListComponent;
            }());
            exports_2("EquipmentListComponent", EquipmentListComponent);
        }
    }
});
System.register("calibrates/calibrates.component", ["angular2/core", "calibrates/equipments/equipment-list.component"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_3, equipment_list_component_1;
    var CalibratesComponent;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (equipment_list_component_1_1) {
                equipment_list_component_1 = equipment_list_component_1_1;
            }],
        execute: function() {
            CalibratesComponent = (function () {
                function CalibratesComponent() {
                }
                CalibratesComponent = __decorate([
                    core_3.Component({
                        selector: 'calibrates',
                        template: "\n    <h2>Calibrates App</h2>\n    <hr>\n    <calibrate-list></calibrate-list>\n  ",
                        directives: [equipment_list_component_1.EquipmentListComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], CalibratesComponent);
                return CalibratesComponent;
            }());
            exports_3("CalibratesComponent", CalibratesComponent);
        }
    }
});
System.register("app.component", ['angular2/core', "calibrates/calibrates.component"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_4, calibrates_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (calibrates_component_1_1) {
                calibrates_component_1 = calibrates_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_4.Component({
                        selector: 'my-app',
                        template: "  \n        <h1>Home Content</h1>\n        <calibrates></calibrates>\n    ",
                        directives: [calibrates_component_1.CalibratesComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_4("AppComponent", AppComponent);
        }
    }
});
System.register("boot", ['angular2/platform/browser', "app.component", "angular2/http"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var browser_1, app_component_1, http_2;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [http_2.HTTP_PROVIDERS]);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbGlicmF0ZXMvc2VydmljZXMvcmVzdGZ1bC5zZXJ2aWNlLnRzIiwiY2FsaWJyYXRlcy9lcXVpcG1lbnRzL2VxdWlwbWVudC1saXN0LmNvbXBvbmVudC50cyIsImNhbGlicmF0ZXMvY2FsaWJyYXRlcy5jb21wb25lbnQudHMiLCJhcHAuY29tcG9uZW50LnRzIiwiYm9vdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFNQTtnQkFDRSxpQ0FBb0IsS0FBVztvQkFBWCxVQUFLLEdBQUwsS0FBSyxDQUFNO2dCQUFHLENBQUM7Z0JBRW5DLGtEQUFnQixHQUFoQjtvQkFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUM7eUJBQ3JELEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBVixDQUFVLENBQUM7eUJBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBRUQsK0NBQWEsR0FBYjtvQkFDRSxJQUFJLElBQUksR0FBRyx5Q0FBeUMsRUFDaEQsSUFBSSxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7b0JBRWhELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFTyw2Q0FBVyxHQUFuQixVQUFvQixHQUFHLEVBQUUsSUFBSTtvQkFDM0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO29CQUNoRSxJQUFJLGNBQWMsR0FBRyxJQUFJLHFCQUFjLENBQUM7d0JBQ3RDLE1BQU0sRUFBRSxvQkFBYSxDQUFDLElBQUk7d0JBQzFCLEdBQUcsRUFBRSxHQUFHO3dCQUNSLE9BQU8s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Ozs7O1lDSkQ7Z0JBQUE7Z0JBRUEsQ0FBQztnQkFWRDtvQkFBQyxnQkFBUyxDQUFDO3dCQUNQLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixRQUFRLEVBQUUsNEVBR1Q7d0JBQ0QsVUFBVSxFQUFFLENBQUMsMENBQW1CLENBQUM7cUJBQ3BDLENBQUM7O2dDQUFBO2dCQUdGLG1CQUFDO1lBQUQsQ0FGQSxBQUVDLElBQUE7WUFGRCx1Q0FFQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQ1JELG1CQUFTLENBQUMsNEJBQVksRUFBRSxDQUFDLHFCQUFjLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4uLy4uLy4uL25vZGUtYW5ndWxhcjItc2VlZC9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7SHR0cCwgSGVhZGVycywgUmVzcG9uc2UsIFJlcXVlc3RNZXRob2QsIFJlcXVlc3QsIFJlcXVlc3RPcHRpb25zfSBmcm9tIFwiYW5ndWxhcjIvaHR0cFwiO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvUnhcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudFJlc3RmdWxTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOiBIdHRwKSB7fVxyXG5cclxuICBnZXRFcXVpcG1lbnRMaXN0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvZXF1aXBtZW50JylcclxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcG9zdEVxdWlwbWVudCgpe1xyXG4gICAgbGV0IHVyaTEgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2VxdWlwbWVudC9icnRzMzEvJyxcclxuICAgICAgICBkYXRhID0geyBhc3NldF9udW1iZXI6IDk5OTk5LCBkZXNjOiBcIjMxMTlcIn07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuUG9zdFJlcXVlc3QodXJpMSxkYXRhKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgUG9zdFJlcXVlc3QodXJsLCBkYXRhKXtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgIGxldCByZXF1ZXN0b3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgIG1ldGhvZDogUmVxdWVzdE1ldGhvZC5Qb3N0LFxyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9odHRwLnJlcXVlc3QobmV3IFJlcXVlc3QocmVxdWVzdG9wdGlvbnMpKVxyXG4gICAgICAubWFwKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgcmV0dXJuIFt7IHN0YXR1czogcmVzLnN0YXR1cywganNvbjogcmVzLmpzb24oKSB9XVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVFcnJvciAoZXJyb3IgOiBSZXNwb25zZSl7XHJcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKS5lcnJvciB8fCAnU2VydmVyIGVycm9yJyk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcclxuaW1wb3J0IHtFcXVpcG1lbnRSZXN0ZnVsU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL3Jlc3RmdWwuc2VydmljZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdjYWxpYnJhdGUtbGlzdCcsXHJcbiAgdGVtcGxhdGU6YFxyXG4gICAgPGgzPm15IGNhbGlicmF0ZSBsaXN0PC9oMz5cclxuICAgIDxidXR0b24gKGNsaWNrKSA9IFwib25HZXRFcXVpcG1lbnQoKVwiPkdFVCBFcXVpcG1lbnRzPC9idXR0b24+XHJcbiAgICA8cD4gT3V0cHV0OiB7e2NhbGlicmF0ZV9qc29ufX08L3A+XHJcbiAgICA8aHI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XHJcbiAgICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWludmVyc2VcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XHJcbiAgICAgICAgICA8dGg+QXNzZXQgTnVtYmVyPC90aD5cclxuICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XHJcbiAgICAgICAgICA8dGg+TG9jYXRpb248L3RoPlxyXG4gICAgICAgICAgPHRoPkxhc3QgQ2FsPC90aD5cclxuICAgICAgICAgIDx0aD5OZXh0IENhbDwvdGg+XHJcbiAgICAgICAgICA8dGg+RmlsZTwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgICAgPC90aGVhZD5cclxuICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNjYWxpYnJhdGUgb2YgY2FsaWJyYXRlc1wiPlxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRkPlNvbWUgQWN0aW9uczwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLmFzc2V0X251bWJlcn19PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUubW9kZWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfTG9jYXRpb24uZGVzY319PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuRUNNU19BdHRyaWJ1dGVzWzBdLmxhc3RfY2FsfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5FQ01TX0F0dHJpYnV0ZXNbMF0ubmV4dF9jYWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfQXR0cmlidXRlc1swXS5maWxlfX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICAgIDxidXR0b24gKGNsaWNrKSA9IFwib25Qb3N0RXF1aXBtZW50KClcIj5DcmVhdGUgYW4gRXF1aXBtZW50PC9idXR0b24+XHJcbiAgICA8cD4gT3V0cHV0OiB7e3Bvc3REYXRhfX08L3A+XHJcbiAgYCxcclxuICBwcm92aWRlcnM6IFtFcXVpcG1lbnRSZXN0ZnVsU2VydmljZV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBFcXVpcG1lbnRMaXN0Q29tcG9uZW50IHtcclxuICBjYWxpYnJhdGVfanNvbjogc3RyaW5nO1xyXG4gIHBvc3REYXRhOiBzdHJpbmc7XHJcbiAgY2FsaWJyYXRlczogYW55O1xyXG4vKiAgY2FsaWJyYXRlczogYW55O1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBodHRwOiBIdHRwKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuICAgIHRoaXMuaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC90YWJsZV9jYWxpYnJhdGUnKS5tYXAocmVzcG9uc2UgPT4gdGhpcy5jYWxpYnJhdGVzID0gcmVzcG9uc2UuanNvbigpLmRhdGEpO1xyXG4gIH0qL1xyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwU2VydmljZTogRXF1aXBtZW50UmVzdGZ1bFNlcnZpY2UpIHt9XHJcblxyXG4gIG9uR2V0RXF1aXBtZW50KCl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5nZXRFcXVpcG1lbnRMaXN0KClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlX2pzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlcyA9IGRhdGEuY2FsaWJyYXRlcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yID0+IGFsZXJ0KGVycm9yKSxcclxuICAgICAgICAoKSAgPT4gY29uc29sZS5sb2coJ0ZpbmlzaGVkJylcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIG9uUG9zdEVxdWlwbWVudCgpe1xyXG4gICAgdGhpcy5faHR0cFNlcnZpY2UucG9zdEVxdWlwbWVudCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgZGF0YSA9PiB0aGlzLnBvc3REYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgZXJyb3IgPT4gYWxlcnQoZXJyb3IpLFxyXG4gICAgICAgICgpICA9PiBjb25zb2xlLmxvZygnRmluaXNoZWQnKVxyXG4gICAgICApO1xyXG4gIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge0VxdWlwbWVudExpc3RDb21wb25lbnR9IGZyb20gXCIuL2VxdWlwbWVudHMvZXF1aXBtZW50LWxpc3QuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NhbGlicmF0ZXMnLFxyXG4gIHRlbXBsYXRlOmBcclxuICAgIDxoMj5DYWxpYnJhdGVzIEFwcDwvaDI+XHJcbiAgICA8aHI+XHJcbiAgICA8Y2FsaWJyYXRlLWxpc3Q+PC9jYWxpYnJhdGUtbGlzdD5cclxuICBgLFxyXG4gIGRpcmVjdGl2ZXM6IFtFcXVpcG1lbnRMaXN0Q29tcG9uZW50XVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbGlicmF0ZXNDb21wb25lbnQge1xyXG5cclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtDYWxpYnJhdGVzQ29tcG9uZW50fSBmcm9tIFwiLi9jYWxpYnJhdGVzL2NhbGlicmF0ZXMuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktYXBwJyxcclxuICAgIHRlbXBsYXRlOiBgICBcclxuICAgICAgICA8aDE+SG9tZSBDb250ZW50PC9oMT5cclxuICAgICAgICA8Y2FsaWJyYXRlcz48L2NhbGlicmF0ZXM+XHJcbiAgICBgLFxyXG4gICAgZGlyZWN0aXZlczogW0NhbGlicmF0ZXNDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xyXG5cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyMi90eXBpbmdzL2Jyb3dzZXIuZC50c1wiLz5cclxuaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xyXG5pbXBvcnQge0FwcENvbXBvbmVudH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge0hUVFBfUFJPVklERVJTfSBmcm9tIFwiYW5ndWxhcjIvaHR0cFwiO1xyXG5cclxuYm9vdHN0cmFwKEFwcENvbXBvbmVudCwgW0hUVFBfUFJPVklERVJTXSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
