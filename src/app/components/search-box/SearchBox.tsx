import React, {Component} from 'react';
import './SearchBox.scss';
import debounce from 'lodash/debounce';

interface SearchBoxPropType {
    queryHandler: (value: string) => void;
}

interface SearchBoxStateType {
    placeholder: string;
    query: string;
}

class SearchBox extends Component<SearchBoxPropType, SearchBoxStateType> {
    queryHandler: any;
    constructor(props: SearchBoxPropType) {
        super(props);
        this.queryHandlerDebounce = debounce(this.queryHandlerDebounce, 500, {
            leading: false
        });
        this.state = {
            placeholder: '搜索歌曲、歌手',
            query: ''
        };
    }

    setQuery = (query: string) => {
        this.setState({
            query: query
        });
    };

    onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.setState({
            query: e.target.value
        });
        // 如果只需要e.target.value, 则这里不需要e.persist()
        // 如果异步回调函数需要对事件做处理，则需要e.persist();
        // e.persist();
        this.queryHandlerDebounce(e.target.value);
    };

    queryHandlerDebounce = (value: string) => {
        this.props.queryHandler(value);
    };

    clear = () => {
        this.setState({
            query: ''
        });
        this.props.queryHandler('');
    };

    render() {
        const {placeholder, query} = this.state;
        return (
            <div className="search-box">
                <i className="icon-search" />
                <input
                    className="box"
                    placeholder={placeholder}
                    onChange={this.onChangeHandler.bind(this)}
                    value={query}
                />
                <i className="icon-dismiss" onClick={this.clear} style={{display: query ? '' : 'none'}} />
            </div>
        );
    }
}

export default SearchBox;
