import angular from 'angular';
import 'angular-bootstrap-npm';
import 'bootstrap/dist/css/bootstrap.css';
import 'angularjs-toaster/toaster.min.css';
import 'angularjs-toaster/toaster.min';
import 'angular-ui-router/release/angular-ui-router.min';
import 'imagesloaded';
import 'semantic-ui/dist/semantic.js';
import 'semantic-ui/dist/semantic.min.css';
//import './vendor/masonry.js'
import 'angular-masonry/angular-masonry';
import './services/services.js';
import './components/general/header/header.js';
import './components/general/login/login.js';
import './components/general/searchtab/searchtab';
import './components/contentmanagement/contentmanagement';
import './components/detailcontainer/detailcontainer';
import './components/general/messagebox/messagebox';
import './components/general/system/system'
const ngModule = angular.module('main_app',['ui.bootstrap',require('angular-animate'),'wu.masonry','app.services','toaster','ui.router','app.header'
                ,'app.login','app.detailContainer','app.searchTab','app.contentManagement','app.messageBox','app.system']);
require ('./config/route.js')(ngModule);
angular.bootstrap(document,['main_app']);

