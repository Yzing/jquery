define( [
	"../core",
	"../var/document",
	"./var/rsingleTag",
	"../manipulation/buildFragment",

	// This is the only module that needs core/support
	"./support"
], function( jQuery, document, rsingleTag, buildFragment, support ) {

"use strict";

// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
// 将 HTML 文本转化成 dom 节点的数组并返回
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	// 如果只有两个参数，且第二个参数为 boolean 类型，则默认为 keepScripts，而非 context
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	// base 用来处理 url 的域，parsed 用来存放解析后的 dom 节点，scripts 用来放 js 脚本片段
	var base, parsed, scripts;

	// 在未指定上下文的情况
	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		// 将 base.href 指向 document.location.href
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	// 开始解析单标签
	parsed = rsingleTag.exec( data );

	// 若传参说明不支持 scripts，则为空数组
	scripts = !keepScripts && [];

	// Single tag
	// 如果是单标签，直接创建节点
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	// 否则创建 fragment，执行 jQuery.buildFragment()
	// data 为 String 类型，将其封装成数组对象传入，返回包含了解析后 dom 节点的文档片段
	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	// 将解析完的节点封装成数组返回
	return jQuery.merge( [], parsed.childNodes );
};

return jQuery.parseHTML;

} );
