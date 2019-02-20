## React.RefObject< T > ##
以项目中ListView为例子来说明typescript如何对ref做类型检查：

	class ListView extends Component<ListViewProps, ListViewState>{
	    listview:React.RefObject<Scroll>;
	    listGroup:React.RefObject<HTMLUListElement>;
	    fixed:React.RefObject<HTMLDivElement>;
	    constructor(props: ListViewProps){
	        super(props);
	        this.listview = React.createRef();
	        this.listGroup = React.createRef();
	        this.fixed = React.createRef();
	        this.state = {
				...
	        }
	    }

	    doSomethingWithRef = () => {
	        this.listview.current && this.listview.current.fnc()
			this.listGroup.current && this.listGroup.current.fnc()
			this.fixed.current && this.fixed.current.fnc()
	    }

		render(){
			return (
				<Scroll ref={this.listview}>
					<ul ref={this.listGroup}>
						...
					</ul>
					<div ref={this.fixed}>
						...
	                </div>
				</Scroll>
			)
		}
	}

当通过ref.current获取组件对应的DOM的时候，可能该组件是不存在的，因此很有必要对组件进行检查，在编译的时候发现错误，因此在实例方法中有以下几种方法，你也可以写一个工具函数用于排雷，下面的给的例子当然只是简单的跳过检查，你也可以根据需要，DOM可能不存在的时候添加一些默认值或者其他的处理手段。

-  &&运算符

			this.listview.current && this.listview.current.fnc()
			this.listGroup.current && this.listGroup.current.fnc()
			this.fixed.current && this.fixed.current.fnc()

- if条件语句
	
			if(!this.listview.current || !this.listGroup.current || ！this.fixed.current)
				return


## ref引用组件实例：React.RefObject< Component > ##
对于组件而言，ref的类型检查估计是非常有用的，可以用来检查组件实例上的方法属性等等的类型不匹配或者其他一些潜在bug，提高项目的稳定性与可维护性。
实际使用方法如例子中所述：
	listview:React.RefObject<Scroll>= React.createRef()


## ref引用DOM：React.RefObject< HTMLDivElement/... > ##

	listGroup:React.RefObject<HTMLUListElement> = React.createRef();
	fixed:React.RefObject<HTMLDivElement> = React.createRef();