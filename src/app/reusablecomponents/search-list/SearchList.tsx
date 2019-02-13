import React,{ Component } from 'react'
import './SearchList.scss'

interface SearchListProps{
    searches:Array<any>,
    selectItem:Function,
    deleteItem:Function
}

interface SearchListState{

}



export default class SearchList extends Component<SearchListProps,SearchListState>{
    constructor(props:SearchListProps){
        super(props);
        this.state={

        }
    }



    render(){
        const {searches,selectItem,deleteItem} = this.props
        return(
            <div className="search-list" style={{display:searches.length?"":"none"}}>
                <ul>
                    {
                        !!searches.length && searches.map((item, index)=>(
                            <li key={index}
                                className="search-item"
                                onClick={()=>{selectItem(item)}}
                            >
                                <span className="text">{item}</span>
                                <span className="icon"
                                      onClick={(e) => {
                                         e.stopPropagation()
                                         deleteItem(item)
                                      }}>
                            <i className="icon-delete"/>
                        </span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}