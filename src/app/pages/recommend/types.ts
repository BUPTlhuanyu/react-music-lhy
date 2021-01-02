import {IDisc} from 'store/stateTypes';

export type Disc = IDisc;

export interface Props {
    fullScreen: boolean;
    setDisc: (disc: IDisc) => void;
    history: any;
    location: any;
    match: any;
}

export interface recommendItem {
    linkUrl: string;
    picUrl: string;
    [key: string]: any;
}

export interface State {
    recommends: recommendItem[];
    discList: IDisc[];
}

// https://github.com/babel/babel-loader/issues/603
// https://stackoverflow.com/questions/53444390/how-to-create-a-package-with-the-isolatedmodules-true-option-enabled
// 与 ts.config 的 --isolatedModules
// 导致无法正常导出
// export type {IDisc}
