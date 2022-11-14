/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Suspense, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import Html from './Html';
import Spinner from './Spinner';
import Layout from './Layout';
import NavBar from './NavBar';
import Comments2 from "./Comments2";

export default function App({assets}) {
    return (
        <Html assets={assets} title="Hello">
            <Suspense fallback={<Spinner/>}>
                <ErrorBoundary FallbackComponent={<div>sdfsd</div>} errorBoundaryOptions={{errorFallback: <div>error boundary</div>}}>
                    <Content/>
                </ErrorBoundary>
            </Suspense>
        </Html>
    );
}

function Content() {
    const s = useState(0)
    const val = s[0]
    const setVal = s[1]
    return (
        <Layout>
            <NavBar/>
            <aside className="sidebar">
            </aside>
            <article className="post">
                    <h2>Comments2</h2>
                    <Suspense>
                        <Comments2 />
                        <div onClick={() => setVal(val + 1)}>hello
                            <h2>sdfsdf{val}</h2>
                        </div>
                    </Suspense>
            </article>
        </Layout>
    );
}
