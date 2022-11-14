/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useState} from 'react'
const time = typeof window !== 'undefined' ? 5000 : 15
let done
const useX = function () {
    console.log(done, 'sdfsd')
    if (done === true) {
        return
    }
    let promise = done
    if (!promise) {
        promise = new Promise(res => setTimeout(() => {
            done = true
            res()
        }, time))
    }
    throw promise
}
export default function Comments2() {
 const s = useState(0)
  const val = s[0]
  const setVal = s[1]

    useX()

  return (
    <>
      <div onClick={() => setVal(val + 1)}>click {val}</div>
    </>
  );
}
