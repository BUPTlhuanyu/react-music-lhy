## withRouter&connect&typescript的使用 ##

为了利用withRouter将history注入到组件的this.props中，需要像如下这样使用connect:
	
	import { connect } from 'react-redux'
	import { withRouter } from 'react-router'
	
	interface DiscBaseStateType{
	    showMusicList: boolean,
	    songs:Array<any>
	}
	
	interface DiscBasePropType{
	    disc:any,
	    history:any
	}
	
	const mapStateToProps = (state:any,ownProps:any) => (
	    {
	        disc:state.disc,
	        ...ownProps
	    }
	)
	
	const Disc = withRouter(connect(mapStateToProps)(DiscBase));
	
	export default Disc