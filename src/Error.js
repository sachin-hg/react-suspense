import React, { Component } from 'react'
class ErrorBoundary extends Component {
    constructor (props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError (error) {
        if (error) return { hasError: true, error: error }
    }
    componentDidCatch (error, errorInfo) {
        console.error('Error: ', error, errorInfo)
    }
    render () {
        let {
            errorBoundaryOptions: {
                errorFallback = null,
                loadFailMessage = 'Something went wrong!',
                silent = true
            } = {},
            children
        } = this.props

        if (this.state.hasError) {
            if (this.state.error.then) {
                // error is a promise, let suspense handle it: throw
                throw this.state.error
            }
            return errorFallback || <DefaultError loadFailMessage={loadFailMessage} silent={silent} />
        }
        return children
    }
}
const DefaultError = ({loadFailMessage, silent}) => {
    if (silent) {
        return null
    } else {
        return <div>{loadFailMessage}</div>
    }
}

export default ErrorBoundary
