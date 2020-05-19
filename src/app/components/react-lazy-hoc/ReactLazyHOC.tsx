import React, { ReactElement } from 'react'

const ReactLazyHOC = <T extends object>(WrapedComponent: any, fallback: ReactElement<any>) => {
    return class extends React.Component<T> {
        render() {
            return (
                <React.Suspense fallback={fallback}>
                    <WrapedComponent {...this.props}/>
                </React.Suspense>
            )
        }
    }
}

export default ReactLazyHOC
