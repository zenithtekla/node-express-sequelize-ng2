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
                    return this._http.get('/equipment')
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                EquipmentRestfulService.prototype.postEquipment = function () {
                    var uri1 = '/equipment/brts31/', data = { asset_number: 99999, desc: "3119" };
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
                function EquipmentListComponent(_httpService) {
                    this._httpService = _httpService;
                }
                EquipmentListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._httpService.getEquipmentList()
                        .subscribe(function (data) {
                        _this.calibrate_json = JSON.stringify(data);
                        _this.calibrates = data.calibrates;
                    }, function (error) { return alert(error); }, function () { return console.log('Finished getEquipmentList'); });
                };
                EquipmentListComponent.prototype.onPostEquipment = function () {
                    var _this = this;
                    this._httpService.postEquipment()
                        .subscribe(function (data) { return _this.postData = JSON.stringify(data); }, function (error) { return alert(error); }, function () { return console.log('Finished onPostEquipment'); });
                };
                EquipmentListComponent = __decorate([
                    core_2.Component({
                        selector: 'calibrate-list',
                        template: "\n    <h3>The calibrate list</h3>\n    <hr>\n    <table class=\"table table-striped\">\n      <thead class=\"thead-inverse\">\n        <tr>\n          <th>Actions</th>\n          <th>Asset Number</th>\n          <th>Model</th>\n          <th>Location</th>\n          <th>Last Cal</th>\n          <th>Next Cal</th>\n          <th>File</th>\n        </tr>\n      </thead>\n      <tbody *ngFor=\"#calibrate of calibrates\">\n      <tr>\n        <td>Some Actions</td>\n        <td>{{calibrate.asset_number}}</td>\n        <td>{{calibrate.model}}</td>\n        <td>{{calibrate.ECMS_Location.desc}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].last_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].next_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].file}}</td>\n      </tr>\n      </tbody>\n    </table>\n    <button (click) = \"onPostEquipment()\">Create an Equipment</button>\n    <p> Output: {{postData}}</p>\n  ",
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
System.register("routes/endpoints.service", ["angular2/core", "angular2/http", 'rxjs/add/operator/map', "rxjs/Rx"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_4, http_2, Rx_2;
    var EndpointsService;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (_2) {},
            function (Rx_2_1) {
                Rx_2 = Rx_2_1;
            }],
        execute: function() {
            EndpointsService = (function () {
                function EndpointsService(_http) {
                    this._http = _http;
                }
                EndpointsService.prototype.getEndpointList = function () {
                    return this._http.get('/json/routeConfig.json')
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                EndpointsService.prototype.PostRequest = function (url, data) {
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var requestoptions = new http_2.RequestOptions({
                        method: http_2.RequestMethod.Post,
                        url: url,
                        headers: headers,
                        body: JSON.stringify(data)
                    });
                    return this._http.request(new http_2.Request(requestoptions))
                        .map(function (res) {
                        if (res) {
                            return [{ status: res.status, json: res.json() }];
                        }
                    })
                        .catch(this.handleError);
                };
                EndpointsService.prototype.handleError = function (error) {
                    console.error(error);
                    return Rx_2.Observable.throw(error.json().error || 'Server error');
                };
                EndpointsService = __decorate([
                    core_4.Injectable(), 
                    __metadata('design:paramtypes', [http_2.Http])
                ], EndpointsService);
                return EndpointsService;
            }());
            exports_4("EndpointsService", EndpointsService);
        }
    }
});
System.register("assets/pipe.component", ["angular2/core"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_5;
    var ValuesPipe;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            }],
        execute: function() {
            ValuesPipe = (function () {
                function ValuesPipe() {
                }
                ValuesPipe.prototype.transform = function (value, args) {
                    var keys = [];
                    for (var key in value) {
                        keys.push({ key: key, value: value[key] });
                    }
                    return keys;
                };
                ValuesPipe = __decorate([
                    core_5.Pipe({ name: 'keys' }), 
                    __metadata('design:paramtypes', [])
                ], ValuesPipe);
                return ValuesPipe;
            }());
            exports_5("ValuesPipe", ValuesPipe);
        }
    }
});
System.register("routes/endpoint-list.component", ["angular2/core", "routes/endpoints.service", "assets/pipe.component"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_6, endpoints_service_1, pipe_component_1;
    var EndpointListComponent;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (endpoints_service_1_1) {
                endpoints_service_1 = endpoints_service_1_1;
            },
            function (pipe_component_1_1) {
                pipe_component_1 = pipe_component_1_1;
            }],
        execute: function() {
            EndpointListComponent = (function () {
                function EndpointListComponent(_httpService) {
                    this._httpService = _httpService;
                }
                EndpointListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._httpService.getEndpointList()
                        .subscribe(function (data) { return _this.apis = data; }, function (error) { return alert(error); }, function () { return console.log('Finished endpoint-list'); });
                };
                EndpointListComponent = __decorate([
                    core_6.Component({
                        selector: 'endpoint-list',
                        template: "\n    <div id=\"endpoint-list\">\n      <h4>LIST of API endpoints</h4>\n      <hr>\n      <div *ngFor=\"#api of apis\">\n        <span>{{api.route}}</span>\n        <table class=\"table table-striped\">\n          <thead class=\"thead-inverse\">\n            <tr>\n              <th>Title</th>\n              <th>Route</th>\n            </tr>\n          </thead>\n          <tbody *ngFor=\"#endpoint of api.endpoints[0] | keys\">\n            <tr>\n              <td>{{endpoint.key}}</td>\n              <td>{{endpoint.value}}</td>\n            <tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ",
                        pipes: [pipe_component_1.ValuesPipe],
                        providers: [endpoints_service_1.EndpointsService]
                    }), 
                    __metadata('design:paramtypes', [endpoints_service_1.EndpointsService])
                ], EndpointListComponent);
                return EndpointListComponent;
            }());
            exports_6("EndpointListComponent", EndpointListComponent);
        }
    }
});
System.register("app.component", ['angular2/core', "calibrates/calibrates.component", "routes/endpoint-list.component"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_7, calibrates_component_1, endpoint_list_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (calibrates_component_1_1) {
                calibrates_component_1 = calibrates_component_1_1;
            },
            function (endpoint_list_component_1_1) {
                endpoint_list_component_1 = endpoint_list_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_7.Component({
                        selector: 'my-app',
                        template: "  \n        <h1>Home Content</h1>\n        <br>\n        <endpoint-list></endpoint-list>\n        <calibrates></calibrates>\n    ",
                        directives: [calibrates_component_1.CalibratesComponent, endpoint_list_component_1.EndpointListComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_7("AppComponent", AppComponent);
        }
    }
});
System.register("boot", ['angular2/platform/browser', "app.component", "angular2/http", "angular2/router"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var browser_1, app_component_1, http_3, router_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (http_3_1) {
                http_3 = http_3_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [http_3.HTTP_PROVIDERS, router_1.ROUTER_PROVIDERS]);
        }
    }
});
System.register("calibrates/equipments/equipment-list-cloned.component", ["angular2/core", "calibrates/services/restful.service"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_8, restful_service_2;
    var EquipmentListClonedComponent;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (restful_service_2_1) {
                restful_service_2 = restful_service_2_1;
            }],
        execute: function() {
            EquipmentListClonedComponent = (function () {
                /*  calibrates: any;
                  constructor(public http: Http) { }
                
                  ngOnInit(){
                    this.http.get('http://localhost:3000/table_calibrate').map(response => this.calibrates = response.json().data);
                  }*/
                function EquipmentListClonedComponent(_httpService) {
                    this._httpService = _httpService;
                }
                EquipmentListClonedComponent.prototype.onGetEquipment = function () {
                    var _this = this;
                    this._httpService.getEquipmentList()
                        .subscribe(function (data) {
                        _this.calibrate_json = JSON.stringify(data);
                        _this.calibrates = data.calibrates;
                    }, function (error) { return alert(error); }, function () { return console.log('Finished getEquipmentList'); });
                };
                EquipmentListClonedComponent.prototype.onPostEquipment = function () {
                    var _this = this;
                    this._httpService.postEquipment()
                        .subscribe(function (data) { return _this.postData = JSON.stringify(data); }, function (error) { return alert(error); }, function () { return console.log('Finished onPostEquipment'); });
                };
                EquipmentListClonedComponent = __decorate([
                    core_8.Component({
                        selector: 'calibrate-list-cloned',
                        template: "\n    <h3>my calibrate list</h3>\n    <button (click) = \"onGetEquipment()\">GET Equipments</button>\n    <p> Output: {{calibrate_json}}</p>\n    <hr>\n    <table class=\"table table-striped\">\n      <thead class=\"thead-inverse\">\n        <tr>\n          <th>Actions</th>\n          <th>Asset Number</th>\n          <th>Model</th>\n          <th>Location</th>\n          <th>Last Cal</th>\n          <th>Next Cal</th>\n          <th>File</th>\n        </tr>\n      </thead>\n      <tbody *ngFor=\"#calibrate of calibrates\">\n      <tr>\n        <td>Some Actions</td>\n        <td>{{calibrate.asset_number}}</td>\n        <td>{{calibrate.model}}</td>\n        <td>{{calibrate.ECMS_Location.desc}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].last_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].next_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].file}}</td>\n      </tr>\n      </tbody>\n    </table>\n    <button (click) = \"onPostEquipment()\">Create an Equipment</button>\n    <p> Output: {{postData}}</p>\n  ",
                        providers: [restful_service_2.EquipmentRestfulService]
                    }), 
                    __metadata('design:paramtypes', [restful_service_2.EquipmentRestfulService])
                ], EquipmentListClonedComponent);
                return EquipmentListClonedComponent;
            }());
            exports_9("EquipmentListClonedComponent", EquipmentListClonedComponent);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbGlicmF0ZXMvc2VydmljZXMvcmVzdGZ1bC5zZXJ2aWNlLnRzIiwiY2FsaWJyYXRlcy9lcXVpcG1lbnRzL2VxdWlwbWVudC1saXN0LmNvbXBvbmVudC50cyIsImNhbGlicmF0ZXMvY2FsaWJyYXRlcy5jb21wb25lbnQudHMiLCJyb3V0ZXMvZW5kcG9pbnRzLnNlcnZpY2UudHMiLCJhc3NldHMvcGlwZS5jb21wb25lbnQudHMiLCJyb3V0ZXMvZW5kcG9pbnQtbGlzdC5jb21wb25lbnQudHMiLCJhcHAuY29tcG9uZW50LnRzIiwiYm9vdC50cyIsImNhbGlicmF0ZXMvZXF1aXBtZW50cy9lcXVpcG1lbnQtbGlzdC1jbG9uZWQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU1BO2dCQUNFLGlDQUFvQixLQUFXO29CQUFYLFVBQUssR0FBTCxLQUFLLENBQU07Z0JBQUcsQ0FBQztnQkFFbkMsa0RBQWdCLEdBQWhCO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7eUJBQ2hDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBVixDQUFVLENBQUM7eUJBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBRUQsK0NBQWEsR0FBYjtvQkFDRSxJQUFJLElBQUksR0FBRyxvQkFBb0IsRUFDM0IsSUFBSSxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7b0JBRWhELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFTyw2Q0FBVyxHQUFuQixVQUFvQixHQUFHLEVBQUUsSUFBSTtvQkFDM0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxj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O29CQVRDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUU7eUJBQ2pDLFNBQVMsQ0FDUixVQUFBLElBQUk7d0JBQ0YsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMzQyxLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ3BDLENBQUMsRUFDRCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBWixDQUFZLEVBQ3JCLGNBQU8sT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLEVBQXhDLENBQXdDLENBQ2hELENBQUM7Z0JBQ04sQ0FBQztnQkFFRCxzREFBZSxHQUFmO29CQUFBLGlCQU9DO29CQU5DLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO3lCQUM5QixTQUFTLENBQ1IsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQXBDLENBQW9DLEVBQzVDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFaLENBQVksRUFDckIsY0FBTyxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsRUFBdkMsQ0FBdUMsQ0FDL0MsQ0FBQztnQkFDTixDQUFDO2dCQXBFSDtvQkFBQyxnQkFBUyxDQUFDO3dCQUNULFFBQVEsRUFBRSx1QkFBdUI7d0JBQ2pDLFFBQVEsRUFBQyw2Z0NBK0JSO3dCQUNELFNBQVMsRUFBRSxDQUFDLHlDQUF1QixDQUFDO3FCQUNyQyxDQUFDOztnREFBQTtnQkFrQ0YsbUNBQUM7WUFBRCxDQWhDQSxBQWdDQyxJQUFBO1lBaENELHVFQWdDQyxDQUFBIiwiZmlsZSI6Ii4uLy4uLy4uL25vZGUtYW5ndWxhcjItc2VlZC9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7SHR0cCwgSGVhZGVycywgUmVzcG9uc2UsIFJlcXVlc3RNZXRob2QsIFJlcXVlc3QsIFJlcXVlc3RPcHRpb25zfSBmcm9tIFwiYW5ndWxhcjIvaHR0cFwiO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvUnhcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudFJlc3RmdWxTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOiBIdHRwKSB7fVxyXG5cclxuICBnZXRFcXVpcG1lbnRMaXN0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KCcvZXF1aXBtZW50JylcclxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcG9zdEVxdWlwbWVudCgpe1xyXG4gICAgbGV0IHVyaTEgPSAnL2VxdWlwbWVudC9icnRzMzEvJyxcclxuICAgICAgICBkYXRhID0geyBhc3NldF9udW1iZXI6IDk5OTk5LCBkZXNjOiBcIjMxMTlcIn07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuUG9zdFJlcXVlc3QodXJpMSxkYXRhKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgUG9zdFJlcXVlc3QodXJsLCBkYXRhKXtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgIGxldCByZXF1ZXN0b3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgIG1ldGhvZDogUmVxdWVzdE1ldGhvZC5Qb3N0LFxyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9odHRwLnJlcXVlc3QobmV3IFJlcXVlc3QocmVxdWVzdG9wdGlvbnMpKVxyXG4gICAgICAubWFwKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgcmV0dXJuIFt7IHN0YXR1czogcmVzLnN0YXR1cywganNvbjogcmVzLmpzb24oKSB9XVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVFcnJvciAoZXJyb3IgOiBSZXNwb25zZSl7XHJcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKS5lcnJvciB8fCAnU2VydmVyIGVycm9yJyk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcclxuaW1wb3J0IHtFcXVpcG1lbnRSZXN0ZnVsU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL3Jlc3RmdWwuc2VydmljZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdjYWxpYnJhdGUtbGlzdCcsXHJcbiAgdGVtcGxhdGU6YFxyXG4gICAgPGgzPlRoZSBjYWxpYnJhdGUgbGlzdDwvaDM+XHJcbiAgICA8aHI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XHJcbiAgICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWludmVyc2VcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XHJcbiAgICAgICAgICA8dGg+QXNzZXQgTnVtYmVyPC90aD5cclxuICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XHJcbiAgICAgICAgICA8dGg+TG9jYXRpb248L3RoPlxyXG4gICAgICAgICAgPHRoPkxhc3QgQ2FsPC90aD5cclxuICAgICAgICAgIDx0aD5OZXh0IENhbDwvdGg+XHJcbiAgICAgICAgICA8dGg+RmlsZTwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgICAgPC90aGVhZD5cclxuICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNjYWxpYnJhdGUgb2YgY2FsaWJyYXRlc1wiPlxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRkPlNvbWUgQWN0aW9uczwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLmFzc2V0X251bWJlcn19PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUubW9kZWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfTG9jYXRpb24uZGVzY319PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuRUNNU19BdHRyaWJ1dGVzWzBdLmxhc3RfY2FsfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5FQ01TX0F0dHJpYnV0ZXNbMF0ubmV4dF9jYWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfQXR0cmlidXRlc1swXS5maWxlfX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICAgIDxidXR0b24gKGNsaWNrKSA9IFwib25Qb3N0RXF1aXBtZW50KClcIj5DcmVhdGUgYW4gRXF1aXBtZW50PC9idXR0b24+XHJcbiAgICA8cD4gT3V0cHV0OiB7e3Bvc3REYXRhfX08L3A+XHJcbiAgYCxcclxuICBwcm92aWRlcnM6IFtFcXVpcG1lbnRSZXN0ZnVsU2VydmljZV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBFcXVpcG1lbnRMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xyXG4gIGNhbGlicmF0ZV9qc29uOiBzdHJpbmc7XHJcbiAgcG9zdERhdGE6IHN0cmluZztcclxuICBjYWxpYnJhdGVzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwU2VydmljZTogRXF1aXBtZW50UmVzdGZ1bFNlcnZpY2UpIHt9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5nZXRFcXVpcG1lbnRMaXN0KClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlX2pzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlcyA9IGRhdGEuY2FsaWJyYXRlcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yID0+IGFsZXJ0KGVycm9yKSxcclxuICAgICAgICAoKSAgPT4gY29uc29sZS5sb2coJ0ZpbmlzaGVkIGdldEVxdWlwbWVudExpc3QnKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgb25Qb3N0RXF1aXBtZW50KCl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5wb3N0RXF1aXBtZW50KClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBkYXRhID0+IHRoaXMucG9zdERhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICAgICAgICBlcnJvciA9PiBhbGVydChlcnJvciksXHJcbiAgICAgICAgKCkgID0+IGNvbnNvbGUubG9nKCdGaW5pc2hlZCBvblBvc3RFcXVpcG1lbnQnKVxyXG4gICAgICApO1xyXG4gIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge0VxdWlwbWVudExpc3RDb21wb25lbnR9IGZyb20gXCIuL2VxdWlwbWVudHMvZXF1aXBtZW50LWxpc3QuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NhbGlicmF0ZXMnLFxyXG4gIHRlbXBsYXRlOmBcclxuICAgIDxoMj5DYWxpYnJhdGVzIEFwcDwvaDI+XHJcbiAgICA8aHI+XHJcbiAgICA8Y2FsaWJyYXRlLWxpc3Q+PC9jYWxpYnJhdGUtbGlzdD5cclxuICBgLFxyXG4gIGRpcmVjdGl2ZXM6IFtFcXVpcG1lbnRMaXN0Q29tcG9uZW50XVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbGlicmF0ZXNDb21wb25lbnQge1xyXG5cclxufSIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcclxuaW1wb3J0IHtIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSwgUmVxdWVzdE1ldGhvZCwgUmVxdWVzdCwgUmVxdWVzdE9wdGlvbnN9IGZyb20gXCJhbmd1bGFyMi9odHRwXCI7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9SeFwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRzU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cCkge31cclxuXHJcbiAgZ2V0RW5kcG9pbnRMaXN0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KCcvanNvbi9yb3V0ZUNvbmZpZy5qc29uJylcclxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBQb3N0UmVxdWVzdCh1cmwsIGRhdGEpe1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgbGV0IHJlcXVlc3RvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtcclxuICAgICAgbWV0aG9kOiBSZXF1ZXN0TWV0aG9kLlBvc3QsXHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAucmVxdWVzdChuZXcgUmVxdWVzdChyZXF1ZXN0b3B0aW9ucykpXHJcbiAgICAgIC5tYXAoKHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICByZXR1cm4gW3sgc3RhdHVzOiByZXMuc3RhdHVzLCBqc29uOiByZXMuanNvbigpIH1dXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUVycm9yIChlcnJvciA6IFJlc3BvbnNlKXtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpLmVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcclxuICB9XHJcbn0iLCJpbXBvcnQge1BpcGVUcmFuc2Zvcm0sIFBpcGV9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcblxyXG5AUGlwZSh7bmFtZTogJ2tleXMnfSlcclxuZXhwb3J0IGNsYXNzIFZhbHVlc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0odmFsdWUsIGFyZ3M6c3RyaW5nW10pIDogYW55IHtcclxuICAgIGxldCBrZXlzID0gW107XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAga2V5cy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlW2tleV19KTtcclxuICAgIH1cclxuICAgIHJldHVybiBrZXlzO1xyXG4gIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7RW5kcG9pbnRzU2VydmljZX0gZnJvbSBcIi4vZW5kcG9pbnRzLnNlcnZpY2VcIjtcclxuaW1wb3J0IHtWYWx1ZXNQaXBlfSBmcm9tIFwiLi4vYXNzZXRzL3BpcGUuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2VuZHBvaW50LWxpc3QnLFxyXG4gIHRlbXBsYXRlOmBcclxuICAgIDxkaXYgaWQ9XCJlbmRwb2ludC1saXN0XCI+XHJcbiAgICAgIDxoND5MSVNUIG9mIEFQSSBlbmRwb2ludHM8L2g0PlxyXG4gICAgICA8aHI+XHJcbiAgICAgIDxkaXYgKm5nRm9yPVwiI2FwaSBvZiBhcGlzXCI+XHJcbiAgICAgICAgPHNwYW4+e3thcGkucm91dGV9fTwvc3Bhbj5cclxuICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XHJcbiAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJ0aGVhZC1pbnZlcnNlXCI+XHJcbiAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICA8dGg+VGl0bGU8L3RoPlxyXG4gICAgICAgICAgICAgIDx0aD5Sb3V0ZTwvdGg+XHJcbiAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNlbmRwb2ludCBvZiBhcGkuZW5kcG9pbnRzWzBdIHwga2V5c1wiPlxyXG4gICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgPHRkPnt7ZW5kcG9pbnQua2V5fX08L3RkPlxyXG4gICAgICAgICAgICAgIDx0ZD57e2VuZHBvaW50LnZhbHVlfX08L3RkPlxyXG4gICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgIDwvdGFibGU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYCxcclxuICBwaXBlczogW1ZhbHVlc1BpcGVdLFxyXG4gIHByb3ZpZGVyczogW0VuZHBvaW50c1NlcnZpY2VdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBhcGlzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwU2VydmljZTogRW5kcG9pbnRzU2VydmljZSkge31cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuICAgIHRoaXMuX2h0dHBTZXJ2aWNlLmdldEVuZHBvaW50TGlzdCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgZGF0YSA9PiB0aGlzLmFwaXMgPSBkYXRhLFxyXG4gICAgICAgIGVycm9yID0+IGFsZXJ0KGVycm9yKSxcclxuICAgICAgICAoKSA9PiBjb25zb2xlLmxvZygnRmluaXNoZWQgZW5kcG9pbnQtbGlzdCcpXHJcbiAgICAgIClcclxuICB9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7Q2FsaWJyYXRlc0NvbXBvbmVudH0gZnJvbSBcIi4vY2FsaWJyYXRlcy9jYWxpYnJhdGVzLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge0VuZHBvaW50TGlzdENvbXBvbmVudH0gZnJvbSBcIi4vcm91dGVzL2VuZHBvaW50LWxpc3QuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktYXBwJyxcclxuICAgIHRlbXBsYXRlOiBgICBcclxuICAgICAgICA8aDE+SG9tZSBDb250ZW50PC9oMT5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGVuZHBvaW50LWxpc3Q+PC9lbmRwb2ludC1saXN0PlxyXG4gICAgICAgIDxjYWxpYnJhdGVzPjwvY2FsaWJyYXRlcz5cclxuICAgIGAsXHJcbiAgICBkaXJlY3RpdmVzOiBbQ2FsaWJyYXRlc0NvbXBvbmVudCwgRW5kcG9pbnRMaXN0Q29tcG9uZW50XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuXHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhcjIvdHlwaW5ncy9icm93c2VyLmQudHNcIi8+XHJcbmltcG9ydCB7Ym9vdHN0cmFwfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcclxuaW1wb3J0IHtBcHBDb21wb25lbnR9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtIVFRQX1BST1ZJREVSU30gZnJvbSBcImFuZ3VsYXIyL2h0dHBcIjtcclxuaW1wb3J0IHtST1VURVJfUFJPVklERVJTfSBmcm9tIFwiYW5ndWxhcjIvcm91dGVyXCI7XHJcblxyXG5ib290c3RyYXAoQXBwQ29tcG9uZW50LCBbSFRUUF9QUk9WSURFUlMsIFJPVVRFUl9QUk9WSURFUlNdKTsiLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge0VxdWlwbWVudFJlc3RmdWxTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvcmVzdGZ1bC5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NhbGlicmF0ZS1saXN0LWNsb25lZCcsXHJcbiAgdGVtcGxhdGU6YFxyXG4gICAgPGgzPm15IGNhbGlicmF0ZSBsaXN0PC9oMz5cclxuICAgIDxidXR0b24gKGNsaWNrKSA9IFwib25HZXRFcXVpcG1lbnQoKVwiPkdFVCBFcXVpcG1lbnRzPC9idXR0b24+XHJcbiAgICA8cD4gT3V0cHV0OiB7e2NhbGlicmF0ZV9qc29ufX08L3A+XHJcbiAgICA8aHI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XHJcbiAgICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWludmVyc2VcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XHJcbiAgICAgICAgICA8dGg+QXNzZXQgTnVtYmVyPC90aD5cclxuICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XHJcbiAgICAgICAgICA8dGg+TG9jYXRpb248L3RoPlxyXG4gICAgICAgICAgPHRoPkxhc3QgQ2FsPC90aD5cclxuICAgICAgICAgIDx0aD5OZXh0IENhbDwvdGg+XHJcbiAgICAgICAgICA8dGg+RmlsZTwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgICAgPC90aGVhZD5cclxuICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNjYWxpYnJhdGUgb2YgY2FsaWJyYXRlc1wiPlxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRkPlNvbWUgQWN0aW9uczwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLmFzc2V0X251bWJlcn19PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUubW9kZWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfTG9jYXRpb24uZGVzY319PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuRUNNU19BdHRyaWJ1dGVzWzBdLmxhc3RfY2FsfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5FQ01TX0F0dHJpYnV0ZXNbMF0ubmV4dF9jYWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfQXR0cmlidXRlc1swXS5maWxlfX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICAgIDxidXR0b24gKGNsaWNrKSA9IFwib25Qb3N0RXF1aXBtZW50KClcIj5DcmVhdGUgYW4gRXF1aXBtZW50PC9idXR0b24+XHJcbiAgICA8cD4gT3V0cHV0OiB7e3Bvc3REYXRhfX08L3A+XHJcbiAgYCxcclxuICBwcm92aWRlcnM6IFtFcXVpcG1lbnRSZXN0ZnVsU2VydmljZV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBFcXVpcG1lbnRMaXN0Q2xvbmVkQ29tcG9uZW50IHtcclxuICBjYWxpYnJhdGVfanNvbjogc3RyaW5nO1xyXG4gIHBvc3REYXRhOiBzdHJpbmc7XHJcbiAgY2FsaWJyYXRlczogYW55O1xyXG4vKiAgY2FsaWJyYXRlczogYW55O1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBodHRwOiBIdHRwKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuICAgIHRoaXMuaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC90YWJsZV9jYWxpYnJhdGUnKS5tYXAocmVzcG9uc2UgPT4gdGhpcy5jYWxpYnJhdGVzID0gcmVzcG9uc2UuanNvbigpLmRhdGEpO1xyXG4gIH0qL1xyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwU2VydmljZTogRXF1aXBtZW50UmVzdGZ1bFNlcnZpY2UpIHt9XHJcblxyXG4gIG9uR2V0RXF1aXBtZW50KCl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5nZXRFcXVpcG1lbnRMaXN0KClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlX2pzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlcyA9IGRhdGEuY2FsaWJyYXRlcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yID0+IGFsZXJ0KGVycm9yKSxcclxuICAgICAgICAoKSAgPT4gY29uc29sZS5sb2coJ0ZpbmlzaGVkIGdldEVxdWlwbWVudExpc3QnKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgb25Qb3N0RXF1aXBtZW50KCl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5wb3N0RXF1aXBtZW50KClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBkYXRhID0+IHRoaXMucG9zdERhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICAgICAgICBlcnJvciA9PiBhbGVydChlcnJvciksXHJcbiAgICAgICAgKCkgID0+IGNvbnNvbGUubG9nKCdGaW5pc2hlZCBvblBvc3RFcXVpcG1lbnQnKVxyXG4gICAgICApO1xyXG4gIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
