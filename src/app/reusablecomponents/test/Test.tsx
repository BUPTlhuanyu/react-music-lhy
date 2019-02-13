import React,{ Component } from 'react'

interface TestProps{
    cont:number
}

interface TestState{
    a:number
}



export default class Test extends Component<TestProps,TestState>{
    static getDerivedStateFromProps(props:TestProps, state:TestState){
        // console.log(props.cont)
        // this.setState({
        //     a:200
        // })
        return {a:200}
    }
    constructor(props:TestProps){
        super(props);
        this.state={
            a:1
        }
    }
    play(){
        if(this.state.a==200){
            console.log(1)
        }
    }
    shouldComponentUpdate(props:TestProps, state:TestState){
        this.play()
        return false
    }
    componentDidUpdate(){
        // this.setState({
        //     a:200
        // })
    }
    getSnapshotBeforeUpdate(){
        // this.setState({
        //     a:200
        // })
    }
    render(){
        return(
            <div>{this.props.cont}</div>
        )
    }
}