import React, {ReactElement} from 'react';

const ReactLazyHOC = <T extends Record<string, any>>(WrapedComponent: any, fallback: ReactElement<any>) => (
    props: T
) => (
    <React.Suspense fallback={fallback}>
        <WrapedComponent {...props} />
    </React.Suspense>
);

export default ReactLazyHOC;
