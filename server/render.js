/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";
import { DataProvider, DataProvider2, DataProvider3 } from "../src/data";
import { API_DELAY, ABORT_DELAY } from "./delays";

// In a real setup, you'd read it from webpack build stats.
let assets = {
  "main.js": "/main.js",
  "main.css": "/main.css"
};

module.exports = function render(url, res) {

  // The new wiring is a bit more involved.
  res.socket.on("error", (error) => {
    console.error("Fatal", error);
  });

  let didError = false;
  const data2 = createServerData2();

  const stream = renderToPipeableStream(
      <DataProvider3 data={{}}>
      <DataProvider2 data={data2}>
        <App assets={assets} />
      </DataProvider2>
    </DataProvider3>,
    {

      onShellReady() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onAllReady() {
       //  stream.pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      },
      bootstrapScripts: [assets['main.js']]
    }
  );

  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(() => stream.abort(), ABORT_DELAY);
};


function createServerData2() {
  let done = false;
  let promise = null;
  return {
    read() {
      if (done) {
        return;
      }
      if (promise) {
        throw promise;
      }
      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true;
          promise = null;
          resolve();
        }, API_DELAY);
      });
      throw promise;
    }
  };
}
