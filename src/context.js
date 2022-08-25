import React, {createContext, useCallback, useContext, useState} from 'react'

export const MyContext = createContext()

window.__APP_VERSION__ = {
    demand: {core: {containerName: 'housing.core_12.3', url: 'containerurl/12.3.js', version: 1.332}},
}

const loadableCache = {}

const promiseCache = {}

const initialiseLoadable = (app, deps) => {
    const loadable = originalLoadComponent(app, deps)
    loadableCache[app] = loadable
    return loadable
}
const getLoadable = (app) => {
    if (promiseCache[app]) {
        return promiseCache[app]
    }
    const promise = fetchDependenciesForApp(app).then(deps => {
        initialiseLoadable(app, deps)
    })
    promiseCache[app] = promise
    return promise
}

const B = ({children, app}) => {
    let loadable = loadableCache[app]
    if (window.__APP_VERSION__[app]) {
        loadable = initialiseLoadable(app, window.__APP_VERSION__[app])
    }
    if (!loadable) {
        throw getLoadable(app)
    }
    return (
        <MyContext.Provider value={loadable}>
            {children}
        </MyContext.Provider>
    )
}
//
const A = ({app, children}) => {
    return (
        <Suspense fallback={<div>..loading</div>}><B app={app}>{children}</B></Suspense>
    )
}

const StorageProvider = () => {
    return (
        <>
            <A app='demand'><A app='supply'></A></A>
            <A app='supply'></A>
        </>
    )
}

export default StorageProvider

let X = loadable(() => import('housing.core/x'))
X = loadable(null, {type: 'remote', remote: 'housing.core', module: './x'})

// {core: {version: 1.0, containerName: 'housing_universalComponents', url: 'https://dev.housing.com/housing_universalComponents.js'}}
const getContainer = (url) => {
    return new Promise(res => {
        document.querySelector("[src=${url}}]").addEventListener('load', () => res())
    })
    // check if script tag is added for same url, if yes, dont add another tag - somehow return a promise which resolves when that script is loaded
    // add script tag => return a promise which resolves when onload even for that script tag is fired
    // wait for onload event
}
const promises = {}
// window.container -> present - chill
// promise found -> chill
// no script tag found -> chill
// script tag found & onload not fired -> chill
// script tag found & onload already happened -> in this case whats the meaning of onload? does it mean the script is executed as well? if yes then window.container should already be present and this usecase is invalid. else we have to find an event where we can ensure that the script is executed as well
const originalLoadComponent = (app, dependencies) => (remote, module) => {
    return async () => {
        const {containerName, url} = dependencies[remote]
        let promise = Promise.resolve()
        if (!window[containerName]) {
            promise = promises[containerName]
            if (!promise) {
                promise = getContainer(url).catch((e) => {
                    console.log(e)
                    promises[containerName] = undefined
                })
                promises[containerName] = promise
            }
        }

        await promise
        // Initializes the share scope. This fills it with known provided modules from this build and all remotes
        await __webpack_init_sharing__('default')

        const container = window[containerName] // or get the container somewhere else
        // Initialize the container, it may provide shared modules
        await container.init(__webpack_share_scopes__.default)
        const factory = await window[containerName].get(module)
        const Module = factory()
        return Module
    }
}



const loadable = (_, {type, remote, module, fallback}) => {
    return function (props) {
        const loadComponent = useContext(MyContext)
        const Component = React.lazy(() => loadComponent(remote, module))
        return (
            <Suspense fallback={fallback}><Comp {...props} /></Suspense>
        )
    }
}

