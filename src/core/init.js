/**
 2017-09-06
 src/core/init.js
 jQuery $ 的构造方式
 入参(selector, context, root)
 1、String
 		详见代码中的注释
 2、空对象(false undefined "" null)
    直接返回jQuery对象
 3、dom节点(如document)
    将dom节点加入context,返回this,即包含了dom节点的jQuery对象
 4、函数
    如果context有ready方法,则执行ready(selector),否则立即执行
 5、jQuery对象
 		复制jQuery对象并返回
 6、其他
 */

// Initialize a jQuery object
define( [
	"../core",
	"../var/document",
	"./var/rsingleTag",

	"../traversing/findFilter"
], function( jQuery, document, rsingleTag ) {

"use strict";

// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {

		// match 用来存正则匹配后的结果数组
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		// 如果 selector 为空，直接返回 jQuery 对象
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		// 如果没传入 root , root默认为 $(document),注意root为一个包含了dom节点的jQuery对象
		root = root || rootjQuery;

		// Handle HTML strings
		// 处理 selector 为 String 的情况
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				// 如果满足该条件，假设selector为HTML代码
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			// 匹配结果为 HTML 代码 或者是 #id 但没有指名上下文时
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				// 如果为 HTML 代码
				if ( match[ 1 ] ) {
					// 修正 context , 转化为 node 对象？
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					// 解析代码详见 parseHTML.js
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					// 判断是否为单标签元素
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				// 处理匹配结果为 #id 且未指定上下文的情况
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			// 如果没有指定上下文，直接用 root 作为参数传入，如果有，则 context.jquery 要有定义，处理选择器的模式
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			// 有上下文但没有定义 jquery，用构造器根据上下文构造 jQuery 对象
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		// 处理 selector 为 dom 节点的情况
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		// 处理 selector 为 Function 的情况
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		// 如果上述情况都不符合，用该方法来处理
		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
// 让 init 方法的原型指向 jQuery 的原型 , 这样 init 构造的实例就可以访问 jQuery 的原型方法
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );

return init;

} );
