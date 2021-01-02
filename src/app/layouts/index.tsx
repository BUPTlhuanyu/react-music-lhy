import React from 'react';

import Header from 'src/app/layouts/header/Header';
import Tab from 'src/app/layouts/tab/Tab';
import Player from 'src/app/layouts/player/Player';

function BasicLayout(props: any) {
    return (
        <>
            <Header />
            <Tab />
            {props.children}
            <Player />
        </>
    );
}

export default BasicLayout;
