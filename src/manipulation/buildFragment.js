define( [
	"../core",
	"./var/rtagName",
	"./var/rscriptType",
	"./wrapMap",
	"./getAll",
	"./setGlobalEval"
], function( jQuery, rtagName, rscriptType, wrapMap, getAll, setGlobalEval ) {

"use strict";

var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {

	// 声明全局变量，避免在循环里反复申请内层和释放内层，提高代码效率
	var elem, tmp, tag, wrap, contains, j,
		// 创建一个文档片段
		fragment = context.createDocumentFragment(),
		// 用于存放节点
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			// 如果 elem 为 Object 对象
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				// 如果 elem 为节点类型，将其封装成数组合并，否则 elem 为数组???，直接合并
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			// ???
			} else {
				// 创建一个临时的 div 标签并加入文档片段，并付值给变量 tmp，因为在后面保存了 tmp 指向 div，所以在第二次循环的时候不用再次创建 div
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				// rtagName 解析出来的第一个元素为匹配的标签，第二个元素为表签的 dom 节点名
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				// table 标签的处理，如 <thead> 标签只能在 <table> 内出现，如果 tag 不在特殊标签里，返回 ["", ""]，便于浏览器解析
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				// 将包裹的外层元素去掉，仅当有特殊标签时才会执行，使 tmp 指向被解析节点的父节点，比如传入的HTML文本为 <thead></thead> 时，tmp 会指向 <table>
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				// 将解析完的标签推入 nodes 中
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				// 使 tmp 指向 div 即 fragment 的第一个子节点
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				// 清空文本节点的内容
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	// 所有元素解析完之后，清空文档片段的文本节点的内容
	fragment.textContent = "";

	// 重置计数器状态
	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		// ??? 在某些条件下，将解析后的节点推入忽略的队列
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}

return buildFragment;
} );
