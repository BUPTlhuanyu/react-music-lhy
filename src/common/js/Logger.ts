/**
 * Loger: 开发模式下用于方便的输出信息，后续需要完善，可以做的东西很多
 * 埋点上报，异常报警等等
 */
type BasicType = number | string | boolean | undefined | null;
interface LoggerObj {
    [name: string]: (...content: BasicType[]) => void;
}

function createColorLogger(colors: string[], name?: string) {
    let LoggerName = name || 'Logger';
    let LoggerObj = {};
    for (let color of colors) {
        (LoggerObj as LoggerObj)[color] = function (...content: BasicType[]): void {
            if (content.length === 0) {
                return;
            }
            let date = new Date();
            let time = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()].join(':');
            if (typeof content[0] === 'string') {
                content[0] = `%c[${time}] ${content[0]}`;
                content.splice(1, 0, `color: ${color}`);
            } else {
                content.unshift(`%c[${time}]`, `color: ${color}`);
            }
            console.log(...content);
        };
    }
    const Logger = Object.assign({}, LoggerObj, console);
    if (!('Logger' in window)) {
        (window as any)[LoggerName] = Logger;
        return true;
    }
    return false;
}

export default createColorLogger;
