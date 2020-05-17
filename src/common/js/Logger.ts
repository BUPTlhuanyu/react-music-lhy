/**
 * Loger: 开发模式下用于方便的输出信息，后续需要完善，可以做的东西很多
 * 埋点上报，异常报警等等
 */
type BasicType = number | string | boolean | undefined | null
interface LoggerObj{
    [name: string]: (...content: Array<BasicType>) => void
}

function createColorLogger(colors: string[], name?: string){
    let LoggerName = name || 'Logger'
    let LoggerObj = {}
    for(let color of colors){
        (<LoggerObj>LoggerObj)[color] = function(...content: Array<BasicType>): void{
            if(content.length > 1) console.group()
            for(let item of content){
                if(
                    typeof item === 'number'        || 
                    typeof item === 'string'        || 
                    typeof item === 'boolean'       || 
                    typeof item === 'undefined'     || 
                    typeof item === 'bigint'
                ){
                    console.log(`%c${item}`, `color: ${color}`)
                }else{
                    console.log(item)
                }
                
            }
            if(content.length > 1) console.groupEnd()
        }  
    }
    const Logger = Object.assign({}, LoggerObj, console)
    if(!('Logger' in window)){
        (window as any)[LoggerName] = Logger
       return true 
    }
    return false
}

export default createColorLogger


