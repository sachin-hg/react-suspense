/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useEffect, useState} from 'react'
import {useData2} from './data';

export default function Comments2() {
  const s = useState(true)
  const comments = useData2();

  useEffect(() => {
      s[1](false)
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
