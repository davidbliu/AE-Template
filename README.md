# AE-Template
Angular Chrome Extension Template

## stuff included

* content script: js/content.js
* background script: js/background.js
* browser action popup: popup.html
* angular with dummy view and controller
  * js/app.js
  * views/main.html
  * controllers/main.js
  
## using angular

the following has nothing to do with chrome extensions

get angular from [here](https://cdnjs.com/libraries/angular.js/1.5.3)

`wget https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular.min.js`

create the app in a js file `app.js`
```js
var myApp = angular.module('ngApp', []);
```

```html
<script src = 'angular.min.js'></script>
<body ng-app = 'appName'>
</body>
```

__add a controller__ by editing `app.js`

```js 
myApp.controller()
```

NVM finish this later
