import React,{ Component } from 'react'
import './SearchBox.scss'
import {debounce } from 'lodash'

interface SearchBoxPropType{
    queryHandler:Function
}

interface SearchBoxStateType{
    placeholder:string,
    query:string
}

class SearchBox extends Component<SearchBoxPropType, SearchBoxStateType>{
    constructor(props:SearchBoxPropType){
        super(props)
        this.state = {
            placeholder:'搜索歌曲、歌手',
            query:''
        }
    }

    setQuery = (query:string) => {
        this.setState({
            query: query
        })
    }

    onChangeHandler = (e:any) => {
        this.setState({
            query: e.target.value
        })
        // this.props.queryHandler(e.target.value)
        e.persist();
        debounce(()=>{console.log('debounce');this.props.queryHandler(e.target.value)},300)()
    }

    clear = () => {
        this.setState({
            query:''
        })
        this.props.queryHandler('')
    }

    render(){
        const { placeholder, query } = this.state
        return(
            <div className="search-box">
                <i className="icon-search"/>
                <input className="box"
                       placeholder={placeholder}
                       onChange={this.onChangeHandler.bind(this)}
                       value={ query }
                />
                <i  className="icon-dismiss"
                    onClick={ this.clear }
                    style={{display:query? "":"none"}}
                />
            </div>
        )
    }
}

export default SearchBox