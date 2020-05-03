import React,{ Component } from 'react'
import './SearchList.scss'

interface SearchListProps{
    searches:Array<string>,
    selectItem:Function,
    deleteItem:Function
}



const SearchList : React.SFC<SearchListProps> = ({searches,selectItem,deleteItem}) => {
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

export default SearchList