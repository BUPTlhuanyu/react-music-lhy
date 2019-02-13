import React,{ Component } from 'react'
import './UserCenter.scss'
import NoResult from 'reuse/no-result/NoResult'
import Scroll from 'reuse/scroll/Scroll'
import { withRouter } from 'react-router'

interface UserCenterProps{
    history:any,
    location:any,
    match:any
}

interface UserCenterState{

}



class UserCenter extends Component<UserCenterProps,UserCenterState>{
    constructor(props:UserCenterProps){
        super(props);
        this.state={

        }
    }

    back = () => {
        this.props.history.goBack();
    }

    render(){
        return(
            <div className="user-center">
                <div className="back" onClick={this.back}>
                    <i className="icon-back"/>
                </div>
                <div className="switches-wrapper">
                    {/*<switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>*/}
                </div>
                <div ref="playBtn" className="play-btn">
                    <i className="icon-play"/>
                    <span className="text">随机播放全部</span>
                </div>
                <div className="list-wrapper" ref="listWrapper">
                    <Scroll ref="favoriteList" className="list-scroll">
                        <div className="list-inner">
                            {/*<song-list :songs="favoriteList" @select="selectSong"></song-list>*/}
                        </div>
                    </Scroll>
                    <Scroll ref="playList" className="list-scroll" >
                        <div className="list-inner">
                            {/*<song-list :songs="playHistory" @select="selectSong"></song-list>*/}
                        </div>
                    </Scroll>
                </div>
                <div className="no-result-wrapper" >
                    <NoResult title="noResultDesc"/>
                </div>
            </div>
        )
    }
}

export default withRouter(UserCenter)