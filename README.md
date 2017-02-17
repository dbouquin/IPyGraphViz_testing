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
