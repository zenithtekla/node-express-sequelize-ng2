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
                EquipmentRestfulService.prototype.deleteEquipment = function (calibrate) {
                    return this._http.delete('/asset_number/' + calibrate.asset_number)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
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
                        _this.calibrates = data;
                    }, function (error) { return alert(error); }, function () { return console.log('Finished getEquipmentList'); });
                };
                EquipmentListComponent.prototype.onPostEquipment = function () {
                    var _this = this;
                    this._httpService.postEquipment()
                        .subscribe(function (data) { return _this.postData = JSON.stringify(data); }, function (error) { return alert(error); }, function () { return console.log('Finished onPostEquipment'); });
                };
                EquipmentListComponent.prototype.onDeleteEquipment = function (calibrate) {
                    var _this = this;
                    this._httpService.deleteEquipment(calibrate)
                        .subscribe(function (data) { return _this.deleteData = JSON.stringify(data); }, function (error) { return alert(error); }, function () { return console.log('Finished onDeleteEquipment'); });
                };
                EquipmentListComponent = __decorate([
                    core_2.Component({
                        selector: 'calibrate-list',
                        template: "\n    <h3>The calibrate list</h3>\n    <hr>\n    <table class=\"table table-striped\">\n      <thead class=\"thead-inverse\">\n        <tr> \n          <th>Asset Number</th>\n          <th>Model</th>\n          <th>Location</th>\n          <th>Last Cal</th>\n          <th>Next Cal</th>\n          <th>File</th>\n          <th>Actions</th>\n        </tr>\n      </thead>\n      <tbody *ngFor=\"#calibrate of calibrates\">\n      <tr> \n        <td>{{calibrate.asset_number}}</td>\n        <td>{{calibrate.model}}</td>\n        <td>{{calibrate.ECMS_Location.desc}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].last_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].next_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].file}}</td>\n        <td>\n          <button (click) = \"onDeleteEquipment(calibrate); $event.stopPropagation()\">Delete an Equipment</button>\n        </td>\n      </tr>\n      </tbody>\n    </table>\n    <button (click) = \"onPostEquipment()\">Create an Equipment</button>\n    <p> Output: {{postData}}</p>\n    <p> Output: {{deleteData}}</p>\n  ",
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
System.register("routes/express-request.service", ["angular2/core", "angular2/http", 'rxjs/add/operator/map', "rxjs/Rx"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_7, http_3, Rx_3;
    var ExpressRequestService;
    return {
        setters:[
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (http_3_1) {
                http_3 = http_3_1;
            },
            function (_3) {},
            function (Rx_3_1) {
                Rx_3 = Rx_3_1;
            }],
        execute: function() {
            ExpressRequestService = (function () {
                function ExpressRequestService(_http) {
                    this._http = _http;
                }
                ExpressRequestService.prototype.getEndpointList = function () {
                    return this._http.get('/json/lastExpressRequest.json')
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                ExpressRequestService.prototype.handleError = function (error) {
                    console.error(error);
                    return Rx_3.Observable.throw(error.json().error || 'Server error');
                };
                ExpressRequestService = __decorate([
                    core_7.Injectable(), 
                    __metadata('design:paramtypes', [http_3.Http])
                ], ExpressRequestService);
                return ExpressRequestService;
            }());
            exports_7("ExpressRequestService", ExpressRequestService);
        }
    }
});
System.register("routes/express-request.component", ["angular2/core", "assets/pipe.component", "routes/express-request.service"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_8, pipe_component_2, express_request_service_1;
    var ExpressRequestComponent;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (pipe_component_2_1) {
                pipe_component_2 = pipe_component_2_1;
            },
            function (express_request_service_1_1) {
                express_request_service_1 = express_request_service_1_1;
            }],
        execute: function() {
            ExpressRequestComponent = (function () {
                function ExpressRequestComponent(_httpService) {
                    this._httpService = _httpService;
                }
                ExpressRequestComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._httpService.getEndpointList()
                        .subscribe(function (data) { return _this.items = data; }, function (error) { return alert(error); }, function () { return console.log('Finished express-request-list'); });
                };
                ExpressRequestComponent = __decorate([
                    core_8.Component({
                        selector: 'express-request',
                        template: "\n    <div id=\"express-request\">\n      <h4 class=\"text-center\">Last Express Request</h4>\n      <div class=\"row\">\n        <p class=\"text-right\">Content from lastExpressRequest.json file</p>\n        <table class=\"table\">\n          <thead class=\"thead-inverse\">\n            <tr>\n              <th>Title</th>\n              <th>Route</th>\n            </tr>\n          </thead>\n          <tbody *ngFor=\"#item of items | keys\">\n            <tr>\n              <td>{{item.key}}</td>\n              <td>{{item.value | json}}</td>\n            <tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ",
                        pipes: [pipe_component_2.ValuesPipe],
                        providers: [express_request_service_1.ExpressRequestService]
                    }), 
                    __metadata('design:paramtypes', [express_request_service_1.ExpressRequestService])
                ], ExpressRequestComponent);
                return ExpressRequestComponent;
            }());
            exports_8("ExpressRequestComponent", ExpressRequestComponent);
        }
    }
});
System.register("app.component", ['angular2/core', "calibrates/calibrates.component", "routes/endpoint-list.component", "routes/express-request.component"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_9, calibrates_component_1, endpoint_list_component_1, express_request_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_9_1) {
                core_9 = core_9_1;
            },
            function (calibrates_component_1_1) {
                calibrates_component_1 = calibrates_component_1_1;
            },
            function (endpoint_list_component_1_1) {
                endpoint_list_component_1 = endpoint_list_component_1_1;
            },
            function (express_request_component_1_1) {
                express_request_component_1 = express_request_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_9.Component({
                        selector: 'my-app',
                        template: "  \n        <h1>Home Content</h1>\n        <br>\n        <endpoint-list></endpoint-list>\n        <express-request></express-request>\n        <calibrates></calibrates>\n    ",
                        directives: [calibrates_component_1.CalibratesComponent, endpoint_list_component_1.EndpointListComponent, express_request_component_1.ExpressRequestComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_9("AppComponent", AppComponent);
        }
    }
});
System.register("boot", ['angular2/platform/browser', "app.component", "angular2/http", "angular2/router"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var browser_1, app_component_1, http_4, router_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (http_4_1) {
                http_4 = http_4_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [http_4.HTTP_PROVIDERS, router_1.ROUTER_PROVIDERS]);
        }
    }
});
System.register("calibrates/equipments/equipment-list-cloned.component", ["angular2/core", "calibrates/services/restful.service"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_10, restful_service_2;
    var EquipmentListClonedComponent;
    return {
        setters:[
            function (core_10_1) {
                core_10 = core_10_1;
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
                    core_10.Component({
                        selector: 'calibrate-list-cloned',
                        template: "\n    <h3>my calibrate list</h3>\n    <button (click) = \"onGetEquipment()\">GET Equipments</button>\n    <p> Output: {{calibrate_json}}</p>\n    <hr>\n    <table class=\"table table-striped\">\n      <thead class=\"thead-inverse\">\n        <tr>\n          <th>Actions</th>\n          <th>Asset Number</th>\n          <th>Model</th>\n          <th>Location</th>\n          <th>Last Cal</th>\n          <th>Next Cal</th>\n          <th>File</th>\n        </tr>\n      </thead>\n      <tbody *ngFor=\"#calibrate of calibrates\">\n      <tr>\n        <td>Some Actions</td>\n        <td>{{calibrate.asset_number}}</td>\n        <td>{{calibrate.model}}</td>\n        <td>{{calibrate.ECMS_Location.desc}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].last_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].next_cal}}</td>\n        <td>{{calibrate.ECMS_Attributes[0].file}}</td>\n      </tr>\n      </tbody>\n    </table>\n    <button (click) = \"onPostEquipment()\">Create an Equipment</button>\n    <p> Output: {{postData}}</p>\n  ",
                        providers: [restful_service_2.EquipmentRestfulService]
                    }), 
                    __metadata('design:paramtypes', [restful_service_2.EquipmentRestfulService])
                ], EquipmentListClonedComponent);
                return EquipmentListClonedComponent;
            }());
            exports_11("EquipmentListClonedComponent", EquipmentListClonedComponent);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbGlicmF0ZXMvc2VydmljZXMvcmVzdGZ1bC5zZXJ2aWNlLnRzIiwiY2FsaWJyYXRlcy9lcXVpcG1lbnRzL2VxdWlwbWVudC1saXN0LmNvbXBvbmVudC50cyIsImNhbGlicmF0ZXMvY2FsaWJyYXRlcy5jb21wb25lbnQudHMiLCJyb3V0ZXMvZW5kcG9pbnRzLnNlcnZpY2UudHMiLCJhc3NldHMvcGlwZS5jb21wb25lbnQudHMiLCJyb3V0ZXMvZW5kcG9pbnQtbGlzdC5jb21wb25lbnQudHMiLCJyb3V0ZXMvZXhwcmVzcy1yZXF1ZXN0LnNlcnZpY2UudHMiLCJyb3V0ZXMvZXhwcmVzcy1yZXF1ZXN0LmNvbXBvbmVudC50cyIsImFwcC5jb21wb25lbnQudHMiLCJib290LnRzIiwiY2FsaWJyYXRlcy9lcXVpcG1lbnRzL2VxdWlwbWVudC1saXN0LWNsb25lZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBTUE7Z0JBQ0UsaUNBQW9CLEtBQVc7b0JBQVgsVUFBSyxHQUFMLEtBQUssQ0FBTTtnQkFBRyxDQUFDO2dCQUVuQyxrREFBZ0IsR0FBaEI7b0JBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQzt5QkFDaEMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzt5QkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFFRCwrQ0FBYSxHQUFiO29CQUNFLElBQUksSUFBSSxHQUFHLG9CQUFvQixFQUMzQixJQUFJLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQztvQkFFaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNy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QUFJO3dCQUNGLEtBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDM0MsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNwQyxDQUFDLEVBQ0QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQVosQ0FBWSxFQUNyQixjQUFPLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxFQUF4QyxDQUF3QyxDQUNoRCxDQUFDO2dCQUNOLENBQUM7Z0JBRUQsc0RBQWUsR0FBZjtvQkFBQSxpQkFPQztvQkFOQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRTt5QkFDOUIsU0FBUyxDQUNSLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFwQyxDQUFvQyxFQUM1QyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBWixDQUFZLEVBQ3JCLGNBQU8sT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLEVBQXZDLENBQXVDLENBQy9DLENBQUM7Z0JBQ04sQ0FBQztnQkFwRUg7b0JBQUMsaUJBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsdUJBQXVCO3dCQUNqQyxRQUFRLEVBQUMsNmdDQStCUjt3QkFDRCxTQUFTLEVBQUUsQ0FBQyx5Q0FBdUIsQ0FBQztxQkFDckMsQ0FBQzs7Z0RBQUE7Z0JBa0NGLG1DQUFDO1lBQUQsQ0FoQ0EsQUFnQ0MsSUFBQTtZQWhDRCx3RUFnQ0MsQ0FBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7SHR0cCwgSGVhZGVycywgUmVzcG9uc2UsIFJlcXVlc3RNZXRob2QsIFJlcXVlc3QsIFJlcXVlc3RPcHRpb25zfSBmcm9tIFwiYW5ndWxhcjIvaHR0cFwiO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvUnhcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudFJlc3RmdWxTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOiBIdHRwKSB7fVxyXG5cclxuICBnZXRFcXVpcG1lbnRMaXN0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KCcvZXF1aXBtZW50JylcclxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcG9zdEVxdWlwbWVudCgpe1xyXG4gICAgbGV0IHVyaTEgPSAnL2VxdWlwbWVudC9icnRzMzEvJyxcclxuICAgICAgICBkYXRhID0geyBhc3NldF9udW1iZXI6IDk5OTk5LCBkZXNjOiBcIjMxMTlcIn07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuUG9zdFJlcXVlc3QodXJpMSxkYXRhKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUVxdWlwbWVudChjYWxpYnJhdGUpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAuZGVsZXRlKCcvYXNzZXRfbnVtYmVyLycrY2FsaWJyYXRlLmFzc2V0X251bWJlcilcclxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBQb3N0UmVxdWVzdCh1cmwsIGRhdGEpe1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgbGV0IHJlcXVlc3RvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtcclxuICAgICAgbWV0aG9kOiBSZXF1ZXN0TWV0aG9kLlBvc3QsXHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAucmVxdWVzdChuZXcgUmVxdWVzdChyZXF1ZXN0b3B0aW9ucykpXHJcbiAgICAgIC5tYXAoKHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICByZXR1cm4gW3sgc3RhdHVzOiByZXMuc3RhdHVzLCBqc29uOiByZXMuanNvbigpIH1dXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUVycm9yIChlcnJvciA6IFJlc3BvbnNlKXtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpLmVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcclxuICB9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge0VxdWlwbWVudFJlc3RmdWxTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvcmVzdGZ1bC5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NhbGlicmF0ZS1saXN0JyxcclxuICB0ZW1wbGF0ZTpgXHJcbiAgICA8aDM+VGhlIGNhbGlicmF0ZSBsaXN0PC9oMz5cclxuICAgIDxocj5cclxuICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWRcIj5cclxuICAgICAgPHRoZWFkIGNsYXNzPVwidGhlYWQtaW52ZXJzZVwiPlxyXG4gICAgICAgIDx0cj4gXHJcbiAgICAgICAgICA8dGg+QXNzZXQgTnVtYmVyPC90aD5cclxuICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XHJcbiAgICAgICAgICA8dGg+TG9jYXRpb248L3RoPlxyXG4gICAgICAgICAgPHRoPkxhc3QgQ2FsPC90aD5cclxuICAgICAgICAgIDx0aD5OZXh0IENhbDwvdGg+XHJcbiAgICAgICAgICA8dGg+RmlsZTwvdGg+XHJcbiAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgICAgPC90aGVhZD5cclxuICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNjYWxpYnJhdGUgb2YgY2FsaWJyYXRlc1wiPlxyXG4gICAgICA8dHI+IFxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5hc3NldF9udW1iZXJ9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLm1vZGVsfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5FQ01TX0xvY2F0aW9uLmRlc2N9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfQXR0cmlidXRlc1swXS5sYXN0X2NhbH19PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuRUNNU19BdHRyaWJ1dGVzWzBdLm5leHRfY2FsfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5FQ01TX0F0dHJpYnV0ZXNbMF0uZmlsZX19PC90ZD5cclxuICAgICAgICA8dGQ+XHJcbiAgICAgICAgICA8YnV0dG9uIChjbGljaykgPSBcIm9uRGVsZXRlRXF1aXBtZW50KGNhbGlicmF0ZSk7ICRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiPkRlbGV0ZSBhbiBFcXVpcG1lbnQ8L2J1dHRvbj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICAgIDxidXR0b24gKGNsaWNrKSA9IFwib25Qb3N0RXF1aXBtZW50KClcIj5DcmVhdGUgYW4gRXF1aXBtZW50PC9idXR0b24+XHJcbiAgICA8cD4gT3V0cHV0OiB7e3Bvc3REYXRhfX08L3A+XHJcbiAgICA8cD4gT3V0cHV0OiB7e2RlbGV0ZURhdGF9fTwvcD5cclxuICBgLFxyXG4gIHByb3ZpZGVyczogW0VxdWlwbWVudFJlc3RmdWxTZXJ2aWNlXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudExpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XHJcbiAgY2FsaWJyYXRlX2pzb246IHN0cmluZztcclxuICBwb3N0RGF0YTogc3RyaW5nO1xyXG4gIGRlbGV0ZURhdGE6IHN0cmluZztcclxuICBjYWxpYnJhdGVzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwU2VydmljZTogRXF1aXBtZW50UmVzdGZ1bFNlcnZpY2UpIHt9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5nZXRFcXVpcG1lbnRMaXN0KClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlX2pzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2FsaWJyYXRlcyA9IGRhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvciA9PiBhbGVydChlcnJvciksXHJcbiAgICAgICAgKCkgID0+IGNvbnNvbGUubG9nKCdGaW5pc2hlZCBnZXRFcXVpcG1lbnRMaXN0JylcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIG9uUG9zdEVxdWlwbWVudCgpe1xyXG4gICAgdGhpcy5faHR0cFNlcnZpY2UucG9zdEVxdWlwbWVudCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgZGF0YSA9PiB0aGlzLnBvc3REYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgZXJyb3IgPT4gYWxlcnQoZXJyb3IpLFxyXG4gICAgICAgICgpICA9PiBjb25zb2xlLmxvZygnRmluaXNoZWQgb25Qb3N0RXF1aXBtZW50JylcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIG9uRGVsZXRlRXF1aXBtZW50KGNhbGlicmF0ZSl7XHJcbiAgICB0aGlzLl9odHRwU2VydmljZS5kZWxldGVFcXVpcG1lbnQoY2FsaWJyYXRlKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIGRhdGEgPT4gdGhpcy5kZWxldGVEYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgZXJyb3IgPT4gYWxlcnQoZXJyb3IpLFxyXG4gICAgICAgICgpICA9PiBjb25zb2xlLmxvZygnRmluaXNoZWQgb25EZWxldGVFcXVpcG1lbnQnKVxyXG4gICAgICApO1xyXG4gIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge0VxdWlwbWVudExpc3RDb21wb25lbnR9IGZyb20gXCIuL2VxdWlwbWVudHMvZXF1aXBtZW50LWxpc3QuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NhbGlicmF0ZXMnLFxyXG4gIHRlbXBsYXRlOmBcclxuICAgIDxoMj5DYWxpYnJhdGVzIEFwcDwvaDI+XHJcbiAgICA8aHI+XHJcbiAgICA8Y2FsaWJyYXRlLWxpc3Q+PC9jYWxpYnJhdGUtbGlzdD5cclxuICBgLFxyXG4gIGRpcmVjdGl2ZXM6IFtFcXVpcG1lbnRMaXN0Q29tcG9uZW50XVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbGlicmF0ZXNDb21wb25lbnQge1xyXG5cclxufSIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcclxuaW1wb3J0IHtIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSwgUmVxdWVzdE1ldGhvZCwgUmVxdWVzdCwgUmVxdWVzdE9wdGlvbnN9IGZyb20gXCJhbmd1bGFyMi9odHRwXCI7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9SeFwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRzU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cCkge31cclxuXHJcbiAgZ2V0RW5kcG9pbnRMaXN0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KCcvanNvbi9yb3V0ZUNvbmZpZy5qc29uJylcclxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBQb3N0UmVxdWVzdCh1cmwsIGRhdGEpe1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgbGV0IHJlcXVlc3RvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtcclxuICAgICAgbWV0aG9kOiBSZXF1ZXN0TWV0aG9kLlBvc3QsXHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHAucmVxdWVzdChuZXcgUmVxdWVzdChyZXF1ZXN0b3B0aW9ucykpXHJcbiAgICAgIC5tYXAoKHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICByZXR1cm4gW3sgc3RhdHVzOiByZXMuc3RhdHVzLCBqc29uOiByZXMuanNvbigpIH1dXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUVycm9yIChlcnJvciA6IFJlc3BvbnNlKXtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpLmVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcclxuICB9XHJcbn0iLCJpbXBvcnQge1BpcGVUcmFuc2Zvcm0sIFBpcGV9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcblxyXG5AUGlwZSh7bmFtZTogJ2tleXMnfSlcclxuZXhwb3J0IGNsYXNzIFZhbHVlc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0odmFsdWUsIGFyZ3M6c3RyaW5nW10pIDogYW55IHtcclxuICAgIGxldCBrZXlzID0gW107XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAga2V5cy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlW2tleV19KTtcclxuICAgIH1cclxuICAgIHJldHVybiBrZXlzO1xyXG4gIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7RW5kcG9pbnRzU2VydmljZX0gZnJvbSBcIi4vZW5kcG9pbnRzLnNlcnZpY2VcIjtcclxuaW1wb3J0IHtWYWx1ZXNQaXBlfSBmcm9tIFwiLi4vYXNzZXRzL3BpcGUuY29tcG9uZW50XCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2VuZHBvaW50LWxpc3QnLFxyXG4gIHRlbXBsYXRlOmBcclxuICAgIDxkaXYgaWQ9XCJlbmRwb2ludC1saXN0XCI+XHJcbiAgICAgIDxoND5MSVNUIG9mIEFQSSBlbmRwb2ludHM8L2g0PlxyXG4gICAgICA8aHI+XHJcbiAgICAgIDxkaXYgKm5nRm9yPVwiI2FwaSBvZiBhcGlzXCI+XHJcbiAgICAgICAgPHNwYW4+e3thcGkucm91dGV9fTwvc3Bhbj5cclxuICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XHJcbiAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJ0aGVhZC1pbnZlcnNlXCI+XHJcbiAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICA8dGg+VGl0bGU8L3RoPlxyXG4gICAgICAgICAgICAgIDx0aD5Sb3V0ZTwvdGg+XHJcbiAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNlbmRwb2ludCBvZiBhcGkuZW5kcG9pbnRzWzBdIHwga2V5c1wiPlxyXG4gICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgPHRkPnt7ZW5kcG9pbnQua2V5fX08L3RkPlxyXG4gICAgICAgICAgICAgIDx0ZD57e2VuZHBvaW50LnZhbHVlfX08L3RkPlxyXG4gICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgIDwvdGFibGU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYCxcclxuICBwaXBlczogW1ZhbHVlc1BpcGVdLFxyXG4gIHByb3ZpZGVyczogW0VuZHBvaW50c1NlcnZpY2VdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBhcGlzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwU2VydmljZTogRW5kcG9pbnRzU2VydmljZSkge31cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuICAgIHRoaXMuX2h0dHBTZXJ2aWNlLmdldEVuZHBvaW50TGlzdCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgZGF0YSA9PiB0aGlzLmFwaXMgPSBkYXRhLFxyXG4gICAgICAgIGVycm9yID0+IGFsZXJ0KGVycm9yKSxcclxuICAgICAgICAoKSA9PiBjb25zb2xlLmxvZygnRmluaXNoZWQgZW5kcG9pbnQtbGlzdCcpXHJcbiAgICAgIClcclxuICB9XHJcbn0iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7SHR0cCwgUmVzcG9uc2V9IGZyb20gXCJhbmd1bGFyMi9odHRwXCI7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9SeFwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRXhwcmVzc1JlcXVlc3RTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOkh0dHApIHtcclxuICB9XHJcblxyXG4gIGdldEVuZHBvaW50TGlzdCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9odHRwLmdldCgnL2pzb24vbGFzdEV4cHJlc3NSZXF1ZXN0Lmpzb24nKVxyXG4gICAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUVycm9yIChlcnJvciA6IFJlc3BvbnNlKXtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpLmVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcclxuICB9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge1ZhbHVlc1BpcGV9IGZyb20gXCIuLi9hc3NldHMvcGlwZS5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtFeHByZXNzUmVxdWVzdFNlcnZpY2V9IGZyb20gXCIuL2V4cHJlc3MtcmVxdWVzdC5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2V4cHJlc3MtcmVxdWVzdCcsXHJcbiAgdGVtcGxhdGU6YFxyXG4gICAgPGRpdiBpZD1cImV4cHJlc3MtcmVxdWVzdFwiPlxyXG4gICAgICA8aDQgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPkxhc3QgRXhwcmVzcyBSZXF1ZXN0PC9oND5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxwIGNsYXNzPVwidGV4dC1yaWdodFwiPkNvbnRlbnQgZnJvbSBsYXN0RXhwcmVzc1JlcXVlc3QuanNvbiBmaWxlPC9wPlxyXG4gICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+XHJcbiAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJ0aGVhZC1pbnZlcnNlXCI+XHJcbiAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICA8dGg+VGl0bGU8L3RoPlxyXG4gICAgICAgICAgICAgIDx0aD5Sb3V0ZTwvdGg+XHJcbiAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgPHRib2R5ICpuZ0Zvcj1cIiNpdGVtIG9mIGl0ZW1zIHwga2V5c1wiPlxyXG4gICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgPHRkPnt7aXRlbS5rZXl9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgPHRkPnt7aXRlbS52YWx1ZSB8IGpzb259fTwvdGQ+XHJcbiAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgPC90YWJsZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHBpcGVzOiBbVmFsdWVzUGlwZV0sXHJcbiAgcHJvdmlkZXJzOiBbRXhwcmVzc1JlcXVlc3RTZXJ2aWNlXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEV4cHJlc3NSZXF1ZXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBpdGVtczogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfaHR0cFNlcnZpY2U6IEV4cHJlc3NSZXF1ZXN0U2VydmljZSkge31cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuICAgIHRoaXMuX2h0dHBTZXJ2aWNlLmdldEVuZHBvaW50TGlzdCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgZGF0YSA9PiB0aGlzLml0ZW1zID0gZGF0YSxcclxuICAgICAgICBlcnJvciA9PiBhbGVydChlcnJvciksXHJcbiAgICAgICAgKCkgPT4gY29uc29sZS5sb2coJ0ZpbmlzaGVkIGV4cHJlc3MtcmVxdWVzdC1saXN0JylcclxuICAgICAgKVxyXG4gIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtDYWxpYnJhdGVzQ29tcG9uZW50fSBmcm9tIFwiLi9jYWxpYnJhdGVzL2NhbGlicmF0ZXMuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7RW5kcG9pbnRMaXN0Q29tcG9uZW50fSBmcm9tIFwiLi9yb3V0ZXMvZW5kcG9pbnQtbGlzdC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtFeHByZXNzUmVxdWVzdENvbXBvbmVudH0gZnJvbSBcIi4vcm91dGVzL2V4cHJlc3MtcmVxdWVzdC5jb21wb25lbnRcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS1hcHAnLFxyXG4gICAgdGVtcGxhdGU6IGAgIFxyXG4gICAgICAgIDxoMT5Ib21lIENvbnRlbnQ8L2gxPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZW5kcG9pbnQtbGlzdD48L2VuZHBvaW50LWxpc3Q+XHJcbiAgICAgICAgPGV4cHJlc3MtcmVxdWVzdD48L2V4cHJlc3MtcmVxdWVzdD5cclxuICAgICAgICA8Y2FsaWJyYXRlcz48L2NhbGlicmF0ZXM+XHJcbiAgICBgLFxyXG4gICAgZGlyZWN0aXZlczogW0NhbGlicmF0ZXNDb21wb25lbnQsIEVuZHBvaW50TGlzdENvbXBvbmVudCwgRXhwcmVzc1JlcXVlc3RDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xyXG5cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyMi90eXBpbmdzL2Jyb3dzZXIuZC50c1wiLz5cclxuaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xyXG5pbXBvcnQge0FwcENvbXBvbmVudH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge0hUVFBfUFJPVklERVJTfSBmcm9tIFwiYW5ndWxhcjIvaHR0cFwiO1xyXG5pbXBvcnQge1JPVVRFUl9QUk9WSURFUlN9IGZyb20gXCJhbmd1bGFyMi9yb3V0ZXJcIjtcclxuXHJcbmJvb3RzdHJhcChBcHBDb21wb25lbnQsIFtIVFRQX1BST1ZJREVSUywgUk9VVEVSX1BST1ZJREVSU10pOyIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7RXF1aXBtZW50UmVzdGZ1bFNlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9yZXN0ZnVsLnNlcnZpY2VcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnY2FsaWJyYXRlLWxpc3QtY2xvbmVkJyxcclxuICB0ZW1wbGF0ZTpgXHJcbiAgICA8aDM+bXkgY2FsaWJyYXRlIGxpc3Q8L2gzPlxyXG4gICAgPGJ1dHRvbiAoY2xpY2spID0gXCJvbkdldEVxdWlwbWVudCgpXCI+R0VUIEVxdWlwbWVudHM8L2J1dHRvbj5cclxuICAgIDxwPiBPdXRwdXQ6IHt7Y2FsaWJyYXRlX2pzb259fTwvcD5cclxuICAgIDxocj5cclxuICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWRcIj5cclxuICAgICAgPHRoZWFkIGNsYXNzPVwidGhlYWQtaW52ZXJzZVwiPlxyXG4gICAgICAgIDx0cj5cclxuICAgICAgICAgIDx0aD5BY3Rpb25zPC90aD5cclxuICAgICAgICAgIDx0aD5Bc3NldCBOdW1iZXI8L3RoPlxyXG4gICAgICAgICAgPHRoPk1vZGVsPC90aD5cclxuICAgICAgICAgIDx0aD5Mb2NhdGlvbjwvdGg+XHJcbiAgICAgICAgICA8dGg+TGFzdCBDYWw8L3RoPlxyXG4gICAgICAgICAgPHRoPk5leHQgQ2FsPC90aD5cclxuICAgICAgICAgIDx0aD5GaWxlPC90aD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgICA8L3RoZWFkPlxyXG4gICAgICA8dGJvZHkgKm5nRm9yPVwiI2NhbGlicmF0ZSBvZiBjYWxpYnJhdGVzXCI+XHJcbiAgICAgIDx0cj5cclxuICAgICAgICA8dGQ+U29tZSBBY3Rpb25zPC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuYXNzZXRfbnVtYmVyfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5tb2RlbH19PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuRUNNU19Mb2NhdGlvbi5kZXNjfX08L3RkPlxyXG4gICAgICAgIDx0ZD57e2NhbGlicmF0ZS5FQ01TX0F0dHJpYnV0ZXNbMF0ubGFzdF9jYWx9fTwvdGQ+XHJcbiAgICAgICAgPHRkPnt7Y2FsaWJyYXRlLkVDTVNfQXR0cmlidXRlc1swXS5uZXh0X2NhbH19PC90ZD5cclxuICAgICAgICA8dGQ+e3tjYWxpYnJhdGUuRUNNU19BdHRyaWJ1dGVzWzBdLmZpbGV9fTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICAgIDwvdGJvZHk+XHJcbiAgICA8L3RhYmxlPlxyXG4gICAgPGJ1dHRvbiAoY2xpY2spID0gXCJvblBvc3RFcXVpcG1lbnQoKVwiPkNyZWF0ZSBhbiBFcXVpcG1lbnQ8L2J1dHRvbj5cclxuICAgIDxwPiBPdXRwdXQ6IHt7cG9zdERhdGF9fTwvcD5cclxuICBgLFxyXG4gIHByb3ZpZGVyczogW0VxdWlwbWVudFJlc3RmdWxTZXJ2aWNlXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudExpc3RDbG9uZWRDb21wb25lbnQge1xyXG4gIGNhbGlicmF0ZV9qc29uOiBzdHJpbmc7XHJcbiAgcG9zdERhdGE6IHN0cmluZztcclxuICBjYWxpYnJhdGVzOiBhbnk7XHJcbi8qICBjYWxpYnJhdGVzOiBhbnk7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHApIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpe1xyXG4gICAgdGhpcy5odHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL3RhYmxlX2NhbGlicmF0ZScpLm1hcChyZXNwb25zZSA9PiB0aGlzLmNhbGlicmF0ZXMgPSByZXNwb25zZS5qc29uKCkuZGF0YSk7XHJcbiAgfSovXHJcbiAgY29uc3RydWN0b3IgKHByaXZhdGUgX2h0dHBTZXJ2aWNlOiBFcXVpcG1lbnRSZXN0ZnVsU2VydmljZSkge31cclxuXHJcbiAgb25HZXRFcXVpcG1lbnQoKXtcclxuICAgIHRoaXMuX2h0dHBTZXJ2aWNlLmdldEVxdWlwbWVudExpc3QoKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jYWxpYnJhdGVfanNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5jYWxpYnJhdGVzID0gZGF0YS5jYWxpYnJhdGVzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3IgPT4gYWxlcnQoZXJyb3IpLFxyXG4gICAgICAgICgpICA9PiBjb25zb2xlLmxvZygnRmluaXNoZWQgZ2V0RXF1aXBtZW50TGlzdCcpXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBvblBvc3RFcXVpcG1lbnQoKXtcclxuICAgIHRoaXMuX2h0dHBTZXJ2aWNlLnBvc3RFcXVpcG1lbnQoKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIGRhdGEgPT4gdGhpcy5wb3N0RGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgICAgIGVycm9yID0+IGFsZXJ0KGVycm9yKSxcclxuICAgICAgICAoKSAgPT4gY29uc29sZS5sb2coJ0ZpbmlzaGVkIG9uUG9zdEVxdWlwbWVudCcpXHJcbiAgICAgICk7XHJcbiAgfVxyXG59Il19
