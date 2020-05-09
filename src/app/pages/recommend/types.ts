import { IDisc } from 'store/stateTypes'

export interface Props{
    setDisc:Function,
    history:any,
    location:any,
    match:any
  }
  
export interface recommendItem{
    linkUrl: string
    picUrl: string
    [key: string]: any
  }
  
export interface State{
    recommends: Array<recommendItem>,
    discList:Array<IDisc>
}

// https://github.com/babel/babel-loader/issues/603
// https://stackoverflow.com/questions/53444390/how-to-create-a-package-with-the-isolatedmodules-true-option-enabled
// 与 ts.config 的 --isolatedModules 
export type {IDisc}