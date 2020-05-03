import React, {Component, ReactNode} from 'react'
import './ProgressCircle.scss'

interface ProgressCirclePropType{
    percent:number,
    radius:number,
    children:ReactNode
}

interface ProgressCircleStateType{
    dashArray:number
}

class ProgressCircle extends Component<ProgressCirclePropType, ProgressCircleStateType>{
    constructor(props:ProgressCirclePropType){
        super(props)
        this.state = {
            dashArray: Math.PI * 100
        }
    }

    dashOffset= ()=> {
        if(Object.is(this.props.percent,NaN)){
            return
        }
        return (1 - this.props.percent) * this.state.dashArray
    }

    render(){
        const radius = this.props.radius || 100;
        const {dashArray} = this.state;
        return (
            <div className="progress-circle">
                <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" strokeDasharray={dashArray}
              strokeDashoffset={this.dashOffset()}/>
                </svg>
                {
                    this.props.children
                }
            </div>
        )
    }
}

export default ProgressCircle