/**
 * @Description: 输入数据： NoResultProps
 * @author: liaohuanyu
 * @date 2019/2/19
 */

import React from 'react';
import './NoResult.scss';

interface NoResultProps {
    title?: string;
}

const NoResult: React.SFC<NoResultProps> = ({title = ''}) => {
    return (
        <div className="no-result">
            <div className="no-result-icon" />
            <p className="no-result-text">{title}</p>
        </div>
    );
};

export default NoResult;
