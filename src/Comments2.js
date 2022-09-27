/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useEffect, useState, useId, useContext, useMemo} from 'react'
import {DataContext3} from './data'
import {useData2} from './data';

const useServerEffect = (cb) => {
    const promises = useContext(DataContext3)
    const id = useId()
    const pr = promises[id]
    console.log(id, promises[id])
    if (pr && pr.done) {
        return pr.value
    }
    if (pr === undefined) {
        const promise = cb()[0]
        if (promise && promise.then) {
            promise.then((x) => {
                promises[id] = {done: true, value: x}
            })
            promises[id] = promise
            throw promise
        }
    }
    throw pr
}

const useD = (d1) => {
    const d = useMemo( () => d1, [])
    return d
}

let x = 0
const getD = () => {
    x++
    return x
}
export default function Comments2({val: value, time}) {
 const s = useState(0)
    const id = useId()
    const d = useD(getD())
    console.log(d, 'heelo', id)
  const val = s[0]
  const setVal = s[1]
  const comments = useData2();
 const x = useServerEffect(() => {
     const promise = new Promise((res, rej) => {
         setTimeout(() => {
             res(value)
         }, time)
     })
     return [promise]
 })
  // if (typeof window === 'undefined') {
  //   throw Promise.reject()
  // }
  // useEffect(() => {
  //     s[1](false)
  // }, [])
  //
  // if (s[0]) {
  //   return <div>..</div>
  // }

  return (
    <>
      {comments.map((comment, i) => (
        <p className="comment" key={i}>
          {comment}
        </p>
      ))}
        {x}
      <div onClick={() => setVal(val + 1)}>click {val}</div>
    </>
  );
}
