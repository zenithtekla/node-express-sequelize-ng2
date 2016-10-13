**ROADMAP of the development**

Add-ons:
JSLint added and functions okay.

Simple mocha tests work.
$ PORT=3006 mocha dev/server/app/tests/general_testing.js
$ curl http://localhost:3000/table_equipment
$ PORT=3011 mocha dev/server/app/tests/base_test.js
$ PORT=3011 mocha -R spec -b dev/server/app/tests/base_test.js
$ gulp test

Failed.
$ gulp test-site

Perhaps, layer the app with Strongloop for UI of all restful API endpoints
https://www.youtube.com/watch?v=0RIrdFfy9t4

Exposure:
tsconfig.compilerOptions.module
http://blog.thoughtram.io/angular/2016/06/08/component-relative-paths-in-angular-2.html

https://github.com/CoolHandDev/ng2-express
https://github.com/echonax/Ng2-rc1-express

http://www.elanderson.net/2016/05/migration-from-angular-2-betas-to-rc/
http://proudmonkey.azurewebsites.net/upgrading-from-angularjs-2-beta-to-rc-6/

https://auth0.com/blog/angular-2-authentication/