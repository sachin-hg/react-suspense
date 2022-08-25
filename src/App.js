/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Suspense, lazy} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import Html from './Html';
import Spinner from './Spinner';
import Layout from './Layout';
import NavBar from './NavBar';
import P from './Post'

const Comments2 = lazy(() => import('./Comments2'));
const Sidebar = lazy(() => import('./Sidebar'));
// const Post = lazy(() => import('./Post' /* webpackPrefetch: true */));
const Post = lazy(() => {
        const a = {
            catch: () => a,
            then: b => {
                b({default: P});
                return a;
            }
        }
        return a
    }
)

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
    return (
        <Layout>
            <NavBar/>
            <aside className="sidebar">
                <Suspense fallback={<Spinner/>}>
                    <Sidebar/>
                </Suspense>
            </aside>
            <article className="post">
                <Suspense fallback={<Spinner/>}>
                    <Post/>
                </Suspense>
                <section className="comments">
                    <h2>Comments2</h2>
                    <Suspense fallback={<Spinner/>}>
                        <Comments2/>
                    </Suspense>
                </section>
                <h2>Thanks for reading!</h2>
            </article>
        </Layout>
    );
}
