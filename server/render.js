/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import {renderToString} from 'react-dom/server';
import { renderToStream } from "react-streaming/server";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";
import { DataProvider, DataProvider2 } from "../src/data";
import { API_DELAY, ABORT_DELAY } from "./delays";

// In a real setup, you'd read it from webpack build stats.
let assets = {
  "main.js": "/main.js",
  "main.css": "/main.css"
};

module.exports = function render(url, res) {
  // This is how you would wire it up previously:
  //
  // res.send(
  //   '<!DOCTYPE html>' +
  //   renderToString(
  //     <DataProvider data={data}>
  //       <App assets={assets} />
  //     </DataProvider>,
  //   )
  // );

  // The new wiring is a bit more involved.
  res.socket.on("error", (error) => {
    console.error("Fatal", error);
  });

  let didError = false;
  const data = createServerData();
  const data2 = createServerData2();
  const opts = {
    bootstrapScripts: [assets['main.js']],
    bootstrapScriptContent: 'window.x = 1'
  }
  const renderToPipeStream = (app, options = {}) => renderToPipeableStream(app, Object.assign({}, opts, options))
  renderToStream(
      <DataProvider2 data={data2}>
      <DataProvider data={data}>
        <App assets={assets} />
      </DataProvider>
      </DataProvider2>,
    { disable: false, renderToPipeableStream: renderToPipeStream }
  ).then(({pipe, streamEnd, injectToStream}) => {
    setTimeout(() => {
      pipe({
        flush: () => res.flush(),
        end: () => res.end(),
        destroy: (err) => res.destroy(err),
        write: (buffer, encoding, cb) => res.write(buffer, () => cb && cb())
      })
    }, 0)
    streamEnd.then((args) => console.log(args, '43534985734'))
    injectToStream('<link rel="stylesheet" href="/main.css">')
    injectToStream('<style>body {background: red}</style>')
  }).catch((e) => {
    // nothing has been written on stream
    console.log(e)
    // renderError()
  });
  return
  const stream = renderToPipeableStream(
      <DataProvider2 data={data2}>
      <DataProvider data={data}>
        <App assets={assets} />
      </DataProvider>
      </DataProvider2>,
    {

      onShellReady() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        setTimeout(() => {
          stream.pipe(res);
        }, 7000)
      },
      onError(x) {
        didError = true;
        console.error(x);
      }
    }
  );
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(() => stream.abort(), ABORT_DELAY);
};

// Simulate a delay caused by data fetching.
// We fake this because the streaming HTML renderer
// is not yet integrated with real data fetching strategies.
function createServerData() {
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
        }, 3000);
      });
      throw promise;
    }
  };
}
