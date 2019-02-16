## getDerivedStateFromProps使用技巧 ##

从react官方动画库react-transition-group中TransitionGroup源码，总结getDerivedStateFromProps的使用技巧：

	class TransitionGroup extends React.Component {
	  constructor(props, context) {
	    super(props, context)
	
	    const handleExited = this.handleExited.bind(this)
	
	    // Initial children should all be entering, dependent on appear
	    this.state = {
	      handleExited,
	      firstRender: true,
	    }
	  }
	
	  static getDerivedStateFromProps(
	    nextProps,
	    { children: prevChildMapping, handleExited, firstRender }
	  ) {
	    return {
	      children: firstRender
	        ? getInitialChildMapping(nextProps, handleExited)
	        : getNextChildMapping(nextProps, prevChildMapping, handleExited),
	      firstRender: false,
	    }
	  }
	
	  handleExited(child, node) {
		...
	  }
		...
	}

getDerivedStateFromProps生命周期接收两个参数，第一个参数nextProps为组件挂载或者更新的时候下一时刻的props，第二个参数prevState为组件当前的state，即挂载阶段在constructor中初始化的state，更新阶段组件本次更新之前的state。
返回值为一个对象，会被react合并到state上。

使用技巧：
1、根据某个props的属性计算state，并更新。
2、当需要使用组件的实例方法的时候，由于getDerivedStateFromProps是组件的静态方法，因此无法直接访问组件实例，因此可以在constructor上将组件的实例方法保存到state中，然后通过state执行实例的实例方法。