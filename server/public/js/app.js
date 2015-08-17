"use strict";angular.module("ogDirectives",["dtrw.bcrypt","ngSanitize","angular-md5"]),angular.module("ogResources",["ngResource"]),angular.module("ogServices",[]),angular.module("OpenGallery",["ngRoute","templates","ogDirectives","ogResources","ogServices"]).config(["$httpProvider",function(e){e.interceptors.push("ogAuthRequestInterceptor")}]).run(["$rootScope","$location","ogAuthService",function(e,t,o){e.$on("$routeChangeStart",function(i,n,r){n.$$route&&("/new"!==n.$$route.originalPath||o.getToken()||(i.preventDefault(),t.path("/auth")),"/auth"===n.$$route.originalPath&&o.getToken()&&t.path("/"),e.$broadcast("restoreFilterState"))}),o.getToken()||o.logout()}]),angular.module("OpenGallery").config(["$routeProvider",function(e){e.when("/auth",{templateUrl:"views/auth/og-auth.html"}).when("/new",{templateUrl:"views/paintings/add/index.html"}).when("/",{templateUrl:"views/paintings/preview/index.html"}).when("/painting/:pId",{templateUrl:"views/paintings/show/og-show.html"}).otherwise({redirectTo:"/"})}]),angular.module("ogServices").factory("ogFilterStateService",["$rootScope",function(e){var t={toolsStates:{},isToolActive:function(e){return t.toolsStates[e]},toggleTool:function(o){t.toolsStates[o]=!t.toolsStates[o],e.$broadcast("filterUpdated",!0)},initTools:function(e){if(window.sessionStorage.filterToolsStates)t.toolsStates=JSON.parse(window.sessionStorage.filterToolsStates);else for(var o=0;o<e.length;o++)t.toolsStates[e[o].value]=!1},saveState:function(){window.sessionStorage.filterToolsStates=JSON.stringify(t.toolsStates)}};return e.$on("saveFilterState",t.saveState),e.$on("filterUpdated",t.saveState),e.$on("restoreFilterState",t.initTools),t}]),angular.module("ogServices").run(["$rootScope",function(e){window.onbeforeunload=function(t){e.$broadcast("saveFilterState")}}]),angular.module("ogDirectives").directive("ogFilter",["ogPaintingToolsResource","ogFilterStateService",function(e,t){return{restrict:"AE",templateUrl:"views/filter/og-filter.html",replace:!0,link:function(o,i){o.$on("filterFrozen",function(e,t){o.isFrozen=t}),o.$on("filterActive",function(e,t){o.isActive=t}),void 0===o.mobileFilterOpen&&(o.mobileFilterOpen=!1);var n=i[0].querySelector("button.filter_smsc");n.addEventListener("click",function(){o.mobileFilterOpen=!o.mobileFilterOpen,o.$apply()});var r=e.get(function(e){e.$promise.then(function(){o.paintingTools=r,t.initTools(r)},function(e){console.log("Error on server: "+e.status+": "+e.data.error)})})}}}]),angular.module("ogDirectives").directive("ogFilterItems",["ogFilterStateService",function(e){return{restrict:"AE",templateUrl:"views/filter/og-filter-items.html",replace:!0,scope:{tool:"="},link:function(t,o){t.isToolActive=function(){return e.isToolActive(t.tool.value)};var i=o[0].querySelector("button");i.addEventListener("click",function(o){e.toggleTool(t.tool.value)}),t.$on("filterFrozen",function(e,t){i.disabled=t})}}}]),angular.module("ogDirectives").directive("ogLoader",function(){return{restrict:"AE",templateUrl:"views/layout/og-loader.html",replace:!0,scope:{show:"=",big:"="}}}),angular.module("ogDirectives").directive("ogIsImageFile",function(){return{restrict:"A",require:["^ngModel","^ogAddPainting"],link:function(e,t,o,i){var n=i[0],r=i[1],a=2097152,s=["image/jpg","image/jpeg","image/png","image/gif"];n.$validators.imageFile=function(e){return e?e.size<a&&~s.indexOf(e.type)?(r.setPaintingFileName(e.name),!0):(r.setPaintingFileName("Select File"),!1):(r.setPaintingFileName("Select File"),!0)},t[0].addEventListener("change",function(t){n.$setViewValue(t.target.files[0]),e.$apply()})}}}),angular.module("ogDirectives").directive("ogIsUnique",["ogRegResource","$q",function(e,t){return{restrict:"A",require:"ngModel",link:function(o,i,n,r){r.$asyncValidators.unique=function(o,n){return t(function(t,o){e.isUnique({alias:i[0].value}).$promise.then(function(e){e.unique?t():o()},function(e){console.log("Some problems on server. "+e.status+": "+e.data.error),o()})})}}}}]),angular.module("ogResources").factory("ogLoginResource",["ogApiUrl","$resource",function(e,t){return t(e+"/auth/login/:alias",{alias:"@alias"},{getPass:{method:"GET"}})}]),angular.module("ogResources").factory("ogRegResource",["ogApiUrl","$resource",function(e,t){return t(e+"/auth/registration",null,{isUnique:{method:"GET",url:e+"/auth/registration/:alias",params:{alias:"@alias"}}})}]),angular.module("ogResources").factory("ogAddPaintingResource",["ogApiUrl","$resource",function(e,t){return t(e+"/confidential/paintings/add/:pId",{pId:"@pId"},{getPrevPaintingID:{method:"GET"},save:{method:"POST",headers:{"Content-Type":void 0},transformRequest:function(e){if(void 0!==e){var t=new FormData;return angular.forEach(e,function(e,o){e instanceof FileList?t.append(o,e[0]):"$promise"!==o&&"$resolved"!==o&&t.append(o,e)}),t}}}})}]),angular.module("ogResources").factory("ogPreviewPaintingsResource",["ogApiUrl","$resource","$cacheFactory",function(e,t,o){return t(e+"/paintings/preview",null,{getPaintings:{method:"GET",isArray:!0,cache:o("/paintings/preview")}})}]),angular.module("ogResources").factory("ogShowPaintingResource",["ogApiUrl","$resource",function(e,t){return t(e+"/paintings/show/:pId",{pId:"@pId"},{getShowInfo:{method:"GET",cache:!0}})}]),angular.module("ogDirectives").directive("ogAuth",["ogAuthService",function(e){return{restrict:"AE",link:function(t){t.title=e.formRegistration?"Registration":"Login",t.newArtist=e.formRegistration}}}]),angular.module("ogDirectives").directive("ogLogin",["ogFormService","ogAuthService","ogLoginResource","bcrypt",function(e,t,o,i){return{restrict:"AE",templateUrl:"views/auth/og-login.html",replace:!0,scope:{newArtist:"="},link:function(n,r){n.login={},n.login.wrongPass=!1,n.login.wrongArtist=!1,n.login.isChecking=!1,n.loginHelp=e.init(r[0]),n.login.submit=function(){n.login.isChecking=!0,o.getPass({alias:n.login.alias}).$promise.then(function(e){n.login.isChecking=!1,e.registered?(n.login.wrongArtist=!1,i.compare(n.login.password,e.pass,function(o,i){i?t.login(n.login.alias,e.token):(n.login.wrongPass=!0,n.$apply())})):n.login.wrongArtist=!0},function(e){t.logout(),console.log("Saving error: "+e.status+": "+e.data.error)})},n.login.goReg=function(){t.goToRegistration()}}}}]),angular.module("ogDirectives").directive("ogRegistration",["ogFormService","ogAuthService","ogRegResource","bcrypt",function(e,t,o,i){var n={restrict:"AE",templateUrl:"views/auth/og-registration.html",replace:!0,scope:{newArtist:"="},link:function(n,r){n.reg={},n.reg.isSaving=!1,n.regHelp=e.init(r[0]),n.reg.submit=function(){n.reg.isSaving=!0;var e={email:n.reg.email,alias:n.reg.alias,pass:""};i.genSalt(10,function(r,a){i.hash(n.reg.password,a,function(i,r){e.pass=r,o.save(e).$promise.then(function(e){n.reg.isSaving=!1,console.log("Data of new artist saved successfully!"),t.login(e.alias,e.token)},function(e){console.log("There was an error saving. "+e.status+": "+e.data.error)})})})},n.reg.goLogin=function(){t.goToLogin()}}};return n}]),angular.module("ogDirectives").directive("ogAddPainting",["ogFormService","ogAuthService","ogAddPaintingResource","ogPaintingToolsResource","$sanitize","$location","md5","$rootScope","$cacheFactory",function(e,t,o,i,n,r,a,s,l){return{restrict:"AE",templateUrl:"views/paintings/add/og-add-painting.html",replace:!0,controller:["$scope",function(e){return this.setPaintingFileName=function(t){e.addP.fileName=t},this}],link:function(g,u){g.addP={},g.addP.isSaving=!1,g.addPHelp=e.init(u[0]);var c=i.get(function(e){e.$promise.then(function(){g.addP.paintingTools=c,g.addP.tool=c[0]},function(e){console.log("Some problems on server: "+e.status+": "+e.data.error)})});g.addP.submit=function(){g.addP.isSaving=!0;var e=g.addP.file.name.slice(-4),i=o.getPrevPaintingID(function(o){o.$promise.then(function(){i.pId++,i.title=n(g.addP.title),i.author=n(g.addP.author),i.tool=g.addP.tool.value,i.description=n(g.addP.desc),i.addedBy=t.getArtist(),i.fileName=a.createHash("opengallerypainting"+i.pId)+e,i.file=g.addP.file,i.$save(function(e){e.$promise.then(function(){l.get("/paintings/preview").removeAll(),setTimeout(function(){s.$evalAsync(function(){r.path("#/")})},5e3)},function(e){g.addP.isSaving=!1,console.log("Error on server: "+e.status+": "+e.data.error)})})},function(e){console.log("Error on server: "+e.status+": "+e.data.error)})})}}}}]),angular.module("ogDirectives").directive("ogGallery",["ogPreviewPaintingsResource","ogFilterStateService","$filter","$rootScope",function(e,t,o,i){return{restrict:"AE",link:function(n){function r(e){return function(t){return a(e)?e[t.toolValue]:!0}}function a(e){for(var t in e)if(e[t])return!0;return!1}n.isLoading=!0,i.$broadcast("filterActive",!0);var s=e.getPaintings(function(e){e.$promise.then(function(){n.isLoading=!1,s[0].pId>0&&(n.paintings=o("filter")(s,r(t.toolsStates)))},function(e){console.log("Error on server: "+e.status+": "+e.data.error)})});n.$on("filterUpdated",function(){n.paintings=o("filter")(s,r(t.toolsStates)),n.$apply()}),n.$on("$destroy",function(){i.$broadcast("filterActive",!1)})}}}]),angular.module("ogDirectives").directive("ogPreviewPainting",function(){return{restrict:"AE",templateUrl:"views/paintings/preview/og-preview-painting.html",replace:!0,scope:{painting:"="}}}),angular.module("ogDirectives").directive("ogShow",["ogShowPaintingResource","ogFilterStateService","$routeParams","$location","$rootScope",function(e,t,o,i,n){return{restrict:"AE",link:function(r){function a(e){var t=[];for(var o in e)e[o]&&t.push(o);return t}r.isLoading=!0,n.$broadcast("filterFrozen",!0);var s=a(t.toolsStates),l=e.getShowInfo({pId:o.pId,filteredTools:s},function(e){e.$promise.then(function(){l.finded?r.painting=l:i.path("/"),r.isLoading=!1},function(e){console.log("Some problems on server: "+e.status+": "+e.data.error)})});r.$on("$destroy",function(){n.$broadcast("filterFrozen",!1)})}}}]),angular.module("ogDirectives").directive("ogShowPainting",function(){return{restrict:"AE",templateUrl:"views/paintings/show/og-show-painting.html",replace:!0,scope:{painting:"="}}}),angular.module("ogResources").factory("ogPaintingToolsResource",["ogApiUrl","$resource",function(e,t){return t(e+"/paintingtools",null,{get:{method:"GET",isArray:!0,cache:!0}})}]),angular.module("ogServices").factory("ogAuthRequestInterceptor",["ogAuthService",function(e){var t={request:function(t){return e.isLoggedIn&&(t.headers["x-access-token"]=e.getToken()),t}};return t}]),angular.module("ogServices").factory("ogAuthService",["$location","$rootScope",function(e,t){return{formRegistration:!1,isLoggedIn:void 0!==window.sessionStorage.token,login:function(o,i){this.isLoggedIn=!0,window.sessionStorage.artist=o,window.sessionStorage.token=i,t.$evalAsync(function(){e.path("/")})},getArtist:function(){return window.sessionStorage.artist||""},getToken:function(){return window.sessionStorage.token},goToRegistration:function(){this.formRegistration=!0,e.path("#/auth")},goToLogin:function(){this.formRegistration=!1,e.path("#/auth")},logout:function(){this.isLoggedIn=!1,delete window.sessionStorage.token,delete window.sessionStorage.artist,e.path("/")}}}]),angular.module("OpenGallery").run(function(){window.sessionStorage||(window.sessionStorage={getItem:function(e){return e&&this.hasOwnProperty(e)?unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1")):null},key:function(e){return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/,"").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[e])},setItem:function(e,t){e&&(document.cookie=escape(e)+"="+escape(t)+"; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/",this.length=document.cookie.match(/\=/g).length)},length:0,removeItem:function(e){e&&this.hasOwnProperty(e)&&(document.cookie=escape(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/",this.length--)},hasOwnProperty:function(e){return new RegExp("(?:^|;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)}},window.sessionStorage.length=(document.cookie.match(/\=/g)||window.sessionStorage).length)}),angular.module("ogServices").value("ogFormPatternsService",{oneWord:/^\s*\w*\s*$/,email:/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i}),angular.module("ogServices").factory("ogFormService",["ogFormTooltipService","ogFormPatternsService",function(e,t){return{init:function(o){var i={};return i.pattern={oneWord:t.oneWord,email:t.email},i.tooltip=e.setTooltips(o),i}}}]),angular.module("ogServices").factory("ogFormTooltipService",function(){return{setTooltips:function(e){var t,o,i={};for(o=0;o<e.length;o++)t=e[o].getAttribute("name"),i[t]={},i[t].msg=this.tooltipsMsg[t],i[t].show=!1;for(o=0;o<e.length-1;o++)e[o].onfocus=function(e){i[e.target.getAttribute("name")].show=!0},e[o].onblur=function(e){i[e.target.getAttribute("name")].show=!1};return i},tooltipsMsg:{fullName:"What is your first and last name?",alias:"Login should contain only letters and numbers (at least 3 and no more than 20 symbols.)",email:'Email should looks like "email@email.email".',password:"Password should contain only letters and numbers (at least 6 and no more than 20 symbols.)",confPassword:"Just repeat your password:)",submit:"All fields are required",addPTitle:"What is the title of new painting?",addPAuthor:"What is author's name ?",addPFile:"Allowed only next types of file: *.jpg, *.jpeg, *.png, *.gif",addPTool:"With which tool the picture was painted in?"}}}),angular.module("ogServices").constant("ogApiUrl","/api/v1"),angular.module("ogDirectives").directive("ogHeader",function(){return{restrict:"AE",templateUrl:"views/layout/header/og-header.html",replace:!0}}),angular.module("ogDirectives").directive("ogNavBody",function(){return{restrict:"AE",replace:!0,templateUrl:"views/layout/header/nav/og-nav-body.html",scope:{loggedin:"=",logout:"="}}}),angular.module("ogDirectives").directive("ogNav",["ogAuthService",function(e){return{restrict:"AE",replace:!0,templateUrl:"views/layout/header/nav/og-nav.html",link:function(t){t.nav={loggedin:e.isLoggedIn,alias:e.isLoggedIn?e.getArtist():"Gallery Menu",logout:function(){e.logout()}},t.$watch(function(){return e.isLoggedIn},function(){t.nav.loggedin=e.isLoggedIn,t.nav.alias=e.isLoggedIn?e.getArtist():"Gallery Menu"},!0)}}}]),angular.module("ogDirectives").directive("ogNavHead",function(){return{restrict:"AE",replace:!0,templateUrl:"views/layout/header/nav/og-nav-head.html",scope:{alias:"="}}});