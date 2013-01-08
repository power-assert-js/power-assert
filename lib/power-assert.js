var powerAssert = function powerAssert(statement) {
    var fileName = (sourceFromStacktrace( 0 ) || "" ).replace(/(:\d+)+\)?/, "").replace(/.+\//, "");

    // so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
    // Later Safari and IE10 are supposed to support error.stack as well
    // See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
    function extractStacktrace( e, offset ) {
	    offset = offset === undefined ? 3 : offset;

	    var stack, include, i, regex;

	    if ( e.stacktrace ) {
		    // Opera
		    return e.stacktrace.split( "\n" )[ offset + 3 ];
	    } else if ( e.stack ) {
		    // Firefox, Chrome
		    stack = e.stack.split( "\n" );
		    if (/^error$/i.test( stack[0] ) ) {
			    stack.shift();
		    }
		    if ( fileName ) {
			    include = [];
			    for ( i = offset; i < stack.length; i++ ) {
				    if ( stack[ i ].indexOf( fileName ) != -1 ) {
					    break;
				    }
				    include.push( stack[ i ] );
			    }
			    if ( include.length ) {
				    return include.join( "\n" );
			    }
		    }
		    return stack[ offset ];
	    } else if ( e.sourceURL ) {
		    // Safari, PhantomJS
		    // hopefully one day Safari provides actual stacktraces
		    // exclude useless self-reference for generated Error objects
		    if ( /qunit.js$/.test( e.sourceURL ) ) {
			    return;
		    }
		    // for actual exceptions, this is useful
		    return e.sourceURL + ":" + e.line;
	    }
    }

    function sourceFromStacktrace( offset ) {
	    try {
		    throw new Error();
	    } catch ( e ) {
		    return extractStacktrace( e, offset );
	    }
    }

    return statement;
};
/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = powerAssert;
}
