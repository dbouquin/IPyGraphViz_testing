## IPyGraphViz_testing

Small apps to test out the messaging/data persistence capabilities of different node.js modules with jupyter

To install, clone this repo `cd` into an app folder and type `npm install`

A jupyter notebook server or kernel will in many cases need to be running in the root directory. In order to simulate Python client side workflow, the notebook file `test.ipynb` will often need to be loaded and run in a kernel from this notebook server.

#### simple_json_chat
Basic chat app with a single message route using express, socket.io and the jupyterlab services API.

1. Initialize notebook server in parent directory, run `test.ipynb` on a new kernel and evaluate the cell with function `echo()`
2. `cd simple_json_chat` and run `npm install` to build dependencies
3. `node index` to run the express app on port 3000
4. navigate browser to localhost:3000 and send a message. A JSON response from Jupyter should be echoed back to the browser and appended to a list.

#### loki_chat2
Expanded chat app based on simple_json_chat. Loki.js is used as an in-browser datastore that pushes all responses into a collection unique to the browser-session. Loki_chat2 has handlers for 3 different Python functions. The frontend gives the user the option to overwrite a database variable and peek at the datastore.

1. Initialize notebook server in parent directory, run `test.ipynb` on a new kernel and evaluate the cell with `echo_methods()`
2. `cd loki_chat2` and run `npm install` to build node dependencies
3. Install bower, `cd loki_chat2/public` and `bower install` to install client dependencies
4. navigate browser to localhost:3000 and send a message. A JSON response from Jupyter should be echoed back to the browser and appended to a list.
5. If _overwrite_ responses that are already keyed in the database will be overwritten with a new call to jupyter.
6. _Show Loki DataStore_ appends the current datastore to the list.

loki_chat2 needs to take in a token parameter for versions of jupyter >= 4.3... In a real application this would be passed in from the python side as command line argument when starting the node application. Here it is just a string that needs to be replaced by the user before running the app and can be found in terminal. localhost:8888/?token=<<token string>>
