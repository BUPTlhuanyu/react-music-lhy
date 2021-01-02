import React, {useCallback} from 'react';
import './Confirm.scss';

enum closeTag {
    CANCEL = 'cancel',
    CONFIRM = 'confirm'
}

interface ConfirmProps {
    text: string;
    confirmBtnText?: string;
    cancelBtnText?: string;
    open: boolean;
    onClose?: (closeTag: closeTag) => void;
}

function Confirm({
    text,
    cancelBtnText = '取消',
    confirmBtnText = '确定',
    onClose = (closeTag: closeTag) => {console.log(closeTag);}, // 注意保持引用不变
    open
}: ConfirmProps) {
    const cancel = useCallback(
        () => {
            onClose(closeTag.CANCEL);
        },
        [onClose]
    );

    const confirm = useCallback(
        () => {
            onClose(closeTag.CONFIRM);
        },
        [onClose]
    );

    return (
        <div className="confirm" style={{display: open ? '' : 'none'}}>
            <div className="confirm-wrapper">
                <div className="confirm-content">
                    <p className="text">{text}</p>
                    <div className="operate">
                        <div className="operate-btn left" onClick={cancel}>
                            {cancelBtnText}
                        </div>
                        <div className="operate-btn" onClick={confirm}>
                            {confirmBtnText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirm;
