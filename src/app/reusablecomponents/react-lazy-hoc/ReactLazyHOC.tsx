import React, { ReactElement } from 'react'

const ReactLazyHOC = function(WrapedComponent: any, fallback: ReactElement<any>) {
    return class extends React.Component {
        render() {
            return (
                <React.Suspense fallback={fallback}>
                    <WrapedComponent />
                </React.Suspense>
            )
        }
    }
}

export default ReactLazyHOC
