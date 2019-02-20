## ListView.tsx ##
该复用组件，需要渲染的数据结构如下代码类型，考虑有二：
1、确保传入的数据含有渲染组件的对于属性
2、确保组件的可复用性，需要加入一些不必须的属性，即

	    [index:number]:any
		[key:string]:any

代码如下：

	/**
	 * @Description:  组件数据类型： Array<dataType>
	 * @author: liaohuanyu
	 * @date 2019/2/19
	*/
	
	type IItem = {
	    id : number
	    name : string
	    avatar : string
	    [index:number]:any
	    [key:string]:any
	}
	
	interface dataType {
	    title:string,
	    items:Array<IItem>
	    [index:number]:any
	    [key:string]:any
	}
	
	interface ListViewProps{
	    data : Array<dataType>,
	    getItem: Function
	}
	
	interface touchType{
	    y1 : number;
	    y2 : number;
	    anchorIndex : string;
	}
	
	interface ListViewState{
	    currentIndex : number,
	    touch : touchType,
	    listHeight:Array<any>
	}
	
	class ListView extends Component<ListViewProps, ListViewState>{
	    constructor(props: ListViewProps){
	        super(props);
	        this.state = {
	            listHeight:[],
	            currentIndex: 0,
	            touch:{
	                y1 : 0,
	                y2 : 0,
	                anchorIndex: ""
	            }
	        }
	    }
		render(){...}
	｝