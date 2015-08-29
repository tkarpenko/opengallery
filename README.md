# Open Gallery

### Description
RESTful web service presents paintings, allows filter them, adding new painting (if you are registered tentatively).

The front-end is implemented with AngularJS, the back-end with Node.js and as database is using Neo4j

### Steps to fire up the project localy:

##### 1. Global installations
Install Node.js

```$ npm install express bower nodemone -g ```

##### 2. Clone project
Open console and go to the folder where you want to save Open Gallery project and run

```$ git clone https://github.com/tkarpenko/opengallery.git ```

##### 3. Launch the front-end 
```
$ cd opengallery/client/
$ npm install karma --save-dev
$ npm install gulp gulp-angular-templatecache gulp-concat gulp-connect gulp-cssmin gulp-if gulp-jade gulp-less gulp-uglify gulp-util karma-chrome-launcher karma-jasmine --save-dev
$ npm install gulp-imagemin --save-dev
$ npm install imagemin-pngquant --save-dev
$ bower install angular angular-bcrypt angular-md5 angular-mocks angular-resource angular-route angular-sanitize bootstrap --save-dev
$ gulp default
```

##### 4. Launch the tests
Open another console or console tab
```
$ cd [path/to]/opengallery/client
$ karma start karma-unit.js
```

##### 5. Launch the back-end 
Open another console or console tab
```
$ cd [path/to]/opengallery/server
$ npm install express path serve-favicon cookie-parser body-parser connect-busboy fs-extra node-neo4j jsonwebtoken --save-dev
$ npm start
```

##### 6. Connect to database (for Windows)
* Download from official site: http://neo4j.com/download/ and install
* Run [Neo4j Home]/ bin/neo4j-community.exe
* On the window that has appeared click “Browse…” and select database that is located in folder [path/to/opengallery]/database.
* Click “Start” button:)

##### 7. Take a look:
Open browser tab with [Open Gallery](http://localhost:3000/).
Open Chrome tab with [Front-end js tests](http://localhost:9876/debug.html). 
Here, in Chrome console the tests are running.