/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useEffect, useState, useTransition} from 'react'
import {useData2} from './data';

export default function Comments2() {
  const s = useState(true)
  const comments = useData2();
  // const c = useTransition()
  // const isTransition = c[0]
  // const startTransition = c[1]

  useEffect(() => {
    // startTransition(() => {
    //   console.log('sdfsd')
    //   s[1](false)
    // });
    // setTimeout(() => {
      s[1](false)
    // }, 1000)
  }, [])

  if (s[0]) {
    return <div>..</div>
  }

  return (
    <>
      {comments.map((comment, i) => (
        <p className="comment" key={i}>
          {comment}
        </p>
      ))}
    </>
  );
}
