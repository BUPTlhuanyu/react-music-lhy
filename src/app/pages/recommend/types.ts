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
