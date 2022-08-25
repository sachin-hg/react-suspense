/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useState} from 'react'
export default function Post() {
  const x = useState(1)
    return (
    <>
      <h1>Hello world</h1>
        <div onClick={() => x[1](x[0] + 1)}>click me {x[0]}</div>
      <p>
        This demo is <b>artificially slowed down</b>. Open{' '}
        <code>server/delays.js</code> to adjust how much different things are
        slowed down.
      </p>
      <p>
        Notice how HTML for comments "streams in" before the JS (or React) has
        loaded on the page.
      </p>
      <p>
        Also notice that the JS for comments and sidebar has been code-split,
        but HTML for it is still included in the server output.
      </p>
    </>
  );
}
