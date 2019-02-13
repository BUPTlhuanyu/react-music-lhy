/**
 * @Description: loadAndUnobserve为加载资源的关键入口函数
 * @author: liaohuanyu
 * @date 2019/2/1
*/
const defaultSettings = {
	elements_selector: "img",
	container: document,
	threshold: 300,
	thresholds: null,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	data_bg: "bg",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	load_delay: 0,
	callback_load: null,
	callback_error: null,
	callback_set: null,
	callback_enter: null,
	callback_finish: null,
	to_webp: false
};

//将用户的设置与默认的设置合并
var getInstanceSettings = customSettings => {
	return Object.assign({}, defaultSettings, customSettings);
};

const dataPrefix = "data-";
const processedDataName = "was-processed";
const timeoutDataName = "ll-timeout";
const trueString = "true";

const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
	var attrName = dataPrefix + attribute;
	if (value === null) {
		element.removeAttribute(attrName);
		return;
	}
	element.setAttribute(attrName, value);
};

const setWasProcessedData = element =>
	setData(element, processedDataName, trueString);

const getWasProcessedData = element =>
	getData(element, processedDataName) === trueString;

const setTimeoutData = (element, value) =>
	setData(element, timeoutDataName, value);

const getTimeoutData = element => getData(element, timeoutDataName);

const purgeProcessedElements = elements => {
	return elements.filter(element => !getWasProcessedData(element));
};

const purgeOneElement = (elements, elementToPurge) => {
	return elements.filter(element => element !== elementToPurge);
};

/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
	var event;
	let eventString = "LazyLoad::Initialized";
	let instance = new classObj(options);
	try {
		// Works in modern browsers
		event = new CustomEvent(eventString, { detail: { instance } });
	} catch (err) {
		// Works in Internet Explorer (all versions)
		event = document.createEvent("CustomEvent");
		event.initCustomEvent(eventString, false, false, { instance });
	}
	window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
function autoInitialize(classObj, options) {
	if (!options) {
		return;
	}
	if (!options.length) {
		// Plain object
		createInstance(classObj, options);
	} else {
		// Array of objects
		for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
			createInstance(classObj, optionsItem);
		}
	}
}

const replaceExtToWebp = (value, condition) =>
	condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;

//判断浏览器是否支持WebP这种图片格式
const detectWebp = () => {
	var webpString = "image/webp";
	var canvas = document.createElement("canvas");

	if (canvas.getContext && canvas.getContext("2d")) {
		return canvas.toDataURL(webpString).indexOf(`data:${webpString}`) === 0;
	}

	return false;
};

//是否是在浏览器环境上运行
const runningOnBrowser = typeof window !== "undefined";

//判断是否是爬虫
const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

//判断是否存在IntersectionObserver这个api
const supportsIntersectionObserver =
	runningOnBrowser && "IntersectionObserver" in window;

//是否支持classList功能
const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

//浏览器是否支持WebP文件格式的标志
const supportsWebp = runningOnBrowser && detectWebp();


const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName,
	toWebpFlag
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
		}
	}
};

const setAttributeIfValue = function(
	element,
	attrName,
	value,
	toWebpFlag
) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
};

const setSourcesImg = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcsetDataName = settings.data_srcset;
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
	}
	//给img元素上的sizes，srcset，src赋值
	const sizesDataValue = getData(element, settings.data_sizes);
	setAttributeIfValue(element, "sizes", sizesDataValue);
	const srcsetDataValue = getData(element, srcsetDataName);
	setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
	const srcDataValue = getData(element, settings.data_src);
	setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
};

const setSourcesIframe = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);

	setAttributeIfValue(element, "src", srcDataValue);
};

const setSourcesVideo = (element, settings) => {
	const srcDataName = settings.data_src;
	const srcDataValue = getData(element, srcDataName);

	setSourcesInChildren(element, "src", srcDataName);
	setAttributeIfValue(element, "src", srcDataValue);
	element.load();
};

const setSourcesBgImage = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
		element.style.backgroundImage = `url("${setValue}")`;
	}

	if (bgDataValue) {
		let setValue = replaceExtToWebp(bgDataValue, toWebpFlag);
		element.style.backgroundImage = setValue;
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

const setSources = (element, instance) => {
	const settings = instance._settings;
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		instance._updateLoadingCount(1);
		//处理一个元素之后，从即将被处理的元素集合中删除
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};

const addClass = (element, className) => {
	if (supportsClassList) {
		element.classList.add(className);
		return;
	}
	element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
	if (supportsClassList) {
		element.classList.remove(className);
		return;
	}
	element.className = element.className
		.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ")
		.replace(/^\s+/, "")
		.replace(/\s+$/, "");
};

const callbackIfSet = (callback, argument) => {
	if (callback) {
		callback(argument);
	}
};

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

//添加load事件，并注册事件的回调函数
const addEventListeners = (element, loadHandler, errorHandler) => {
	addEventListener(element, genericLoadEventName, loadHandler);
	addEventListener(element, mediaLoadEventName, loadHandler);
	addEventListener(element, errorEventName, errorHandler);
};

const removeEventListeners = (element, loadHandler, errorHandler) => {
	removeEventListener(element, genericLoadEventName, loadHandler);
	removeEventListener(element, mediaLoadEventName, loadHandler);
	removeEventListener(element, errorEventName, errorHandler);
};

const eventHandler = function(event, success, instance) {
	var settings = instance._settings;
	const className = success ? settings.class_loaded : settings.class_error;
	const callback = success ? settings.callback_load : settings.callback_error;
	const element = event.target;

	removeClass(element, settings.class_loading);
	addClass(element, className);
	callbackIfSet(callback, element);

	instance._updateLoadingCount(-1);
};

const addOneShotEventListeners = (element, instance) => {
	const loadHandler = event => {
		eventHandler(event, true, instance);
		removeEventListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		eventHandler(event, false, instance);
		removeEventListeners(element, loadHandler, errorHandler);
	};
	addEventListeners(element, loadHandler, errorHandler);
};

const managedTags = ["IMG", "IFRAME", "VIDEO"];

const loadAndUnobserve = (element, observer, instance) => {
	revealElement(element, instance);
	observer.unobserve(element);
};

//清除定时器
const cancelDelayLoad = element => {
	var timeoutId = getTimeoutData(element);
	if (!timeoutId) {
		return; // do nothing if timeout doesn't exist
	}
	clearTimeout(timeoutId);
	setTimeoutData(element, null);
};

const delayLoad = (element, observer, instance) => {
	var loadDelay = instance._settings.load_delay;
	var timeoutId = getTimeoutData(element);
	if (timeoutId) {
		return; // do nothing if timeout already set
	}
	timeoutId = setTimeout(function() {
		loadAndUnobserve(element, observer, instance);
		//清除定时器，取消延迟执行
		cancelDelayLoad(element);
	}, loadDelay);
	//将定时器id保存到元素的自定义属性上。
	setTimeoutData(element, timeoutId);
};

function revealElement(element, instance, force) {
	var settings = instance._settings;
	//判断不需要强制加载并且该元素已经加载完成，则不需要做任何操作
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	//执行用户给的回调函数：settings.callback_enter（element）
	callbackIfSet(settings.callback_enter, element);
	if (managedTags.indexOf(element.tagName) > -1) {
		//设置自定义事件，当element的load之后将loading状态的class替换成loaded
		addOneShotEventListeners(element, instance);
		//设置element的class为loading，表示正在加载
		addClass(element, settings.class_loading);
	}
	//主要的加载逻辑在setSources函数中，如果是img则调用setSourcesImg函数，
	// setSourcesImg函数对图片作了优化，选用WebP的文件格式进行优化。
	setSources(element, instance);
	//在元素上设置属性data-wap-processed为true
	setWasProcessedData(element);
	callbackIfSet(settings.callback_set, element);
}

/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.thresholds || settings.threshold + "px"
});

const LazyLoad = function(customSettings, elements) {
	//将用户的设置与默认的设置合并
	this._settings = getInstanceSettings(customSettings);
    //创建IntersectionObserver实例，设置事件回调函数
	this._setObserver();
    //loading的数量
	this._loadingCount = 0;
    //开始对目标元素监听
	this.update(elements);
};

LazyLoad.prototype = {
	_manageIntersection: function(entry) {
		var observer = this._observer;
		var loadDelay = this._settings.load_delay;
		var element = entry.target;

		//判断用户是否设置了延迟加载的时间，即停留在可视窗口（或者已经与祖先元素有交叉）的一定时间之后再加载图片
		// WITHOUT LOAD DELAY
		if (!loadDelay) {
			//判断（entry：element）是否已经与祖先元素有交叉
			if (isIntersecting(entry)) {
				loadAndUnobserve(element, observer, this);
			}
			return;
		}

		// WITH LOAD DELAY
		if (isIntersecting(entry)) {
			delayLoad(element, observer, this);
		} else {
			cancelDelayLoad(element);
		}
	},

	_onIntersection: function(entries) {
		entries.forEach(this._manageIntersection.bind(this));
	},

	//监听器
	_setObserver: function() {
		//判断浏览器是否支持IntersectionObserver
		if (!supportsIntersectionObserver) {
			return;
		}
		//
		this._observer = new IntersectionObserver(
			this._onIntersection.bind(this),
			getObserverSettings(this._settings)
		);
	},

	_updateLoadingCount: function(plusMinus) {
		this._loadingCount += plusMinus;
		if (this._elements.length === 0 && this._loadingCount === 0) {
			callbackIfSet(this._settings.callback_finish);
		}
	},

	update: function(elements) {
		const settings = this._settings;
		const nodeSet =
			elements ||
			settings.container.querySelectorAll(settings.elements_selector);

		//获取没有被处理的元素集合
		this._elements = purgeProcessedElements(
			Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
		);

		if (isBot || !this._observer) {
			this.loadAll();
			return;
		}

        //每个元素都用IntersectionObserver创建的监听器进行监听，当img元素与root交叉时，执行设置的回调函数。
		this._elements.forEach(element => {
			this._observer.observe(element);
		});
	},

	destroy: function() {
		if (this._observer) {
			this._elements.forEach(element => {
				this._observer.unobserve(element);
			});
			this._observer = null;
		}
		this._elements = null;
		this._settings = null;
	},

	load: function(element, force) {
		revealElement(element, this, force);
	},

	loadAll: function() {
		var elements = this._elements;
		elements.forEach(element => {
			this.load(element);
		});
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
