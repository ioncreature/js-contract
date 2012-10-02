/**
 * @author Marenin Alexander
 * October 2012
 */

/*
	// using
	var sqrt = (function( x ){ return Math.sqrt(x); })
		.expect( 'number' )
		.require( function( x ){ return x >= 0; } )
		.returns( 'number' )
		.ensure( function( res ){ return res >= 0; } );

	sqrt( 1 ) // => 1
	sqrt( -1 ) // => TypeError
	sqrt( 'hello' ) // => TypeError
*/

(function jsContract(){

	var tests = {
		number: function( val ){
			return typeof val === 'number' || val instanceof Number;
		},
		string: function( val ){
			return typeof val === 'string' || val instanceof String;
		},
		date: function( val ){
			return val instanceof Date;
		},
		array: function( val ){
			return val instanceof Array;
		},
		arrayLike: function( val ){
			return typeof val === 'object'
				&& val.hasOwnProperty('length')
				&& tests.number( val.length )
				&& val.length >= 0;
		},
		object: function( val ){
			return typeof val === 'object' && val !== null;
		},
		'function': function( val ){
			return typeof val === 'function';
		}
	};


	// define new exception type
	function ContractViolationError( message, /*string?*/ fileName, /*number?*/ lineNumber ){
		this.message = message;
		Error.apply( this, arguments );
	}
	ContractViolationError.prototype = new Error();
	ContractViolationError.prototype.constructor = ContractViolationError;


	function getWrapper( fn ){
		if ( getContract(fn) )
			return fn;

		var wrapper = function(){
			var contract = getContract( fn ),
				object = this || null,
				invariant = object && object.invariant,
				result;

			contract.expect && testExpectations( arguments, contract.expect );
			contract.require && testRequirements( arguments, contract.require, object );

			result = fn.apply( object, arguments );

			contract.returns && testReturns( result, contract.returns );
			contract.ensure && testInsurance( result, contract.ensure );
			invariant && testInvariant( object, invariant );

			return result;
		};

		setContract( wrapper, {} );
		return wrapper;
	}


	function getContract( fn ){
		return typeof fn._contract === 'object' && fn._contract;
	}


	function setContract( fn, contract ){
		fn._contract = contract;
	}


	function testExpectations( args, expects ){
		for ( var i = 0; i < expects.length; i++ )
			if ( !tests[expects[i]](arguments[i]) )
				throw new TypeError( 'Expected "'+ expects[i] + ' but got ' + arguments[i] );
	}


	function testRequirements( args, requirements, context ){
		for ( var i = 0; i < requirements.length; i++ )
			if ( !requirements[i].apply(context, args) )
				throw new ContractViolationError( 'Input parameters do not correspond to the contract' );
	}


	function testReturns( result, rule ){
		if ( !tests[rule](result) )
			throw new TypeError( 'Expected "'+ rule + ' but got ' + result );
	}


	function testInsurance( result, ensureFn, context ){
		if ( !ensureFn.call(context, result) )
			throw new ContractViolationError( 'Return value do not correspond to the contract' );
	}


	function testInvariant( object, invariant ){
		if ( !invariant.call(object) )
			throw new ContractViolationError( 'Expected "'+ rule + ' but got ' + result );
	}


	function define( name, fn ){
		Object.defineProperty( Function.prototype, name, {
			value: fn,
			enumerable: false,
			configurable: true,
			writable: true
		});
	}


	define( 'expect', function(){
		var wrapper = getWrapper( this ),
			contract = getContract( wrapper );

		contract.expect = Array.prototype.slice.call( arguments );

		return wrapper;
	});


	define( 'require', function( requireFn ){
		var wrapper = getWrapper( this ),
			contract = getContract( wrapper );

		if ( contract.require instanceof Array )
			contract.require.push( requireFn );
		else
			contract.require = [requireFn];

		return wrapper;
	});


	define( 'returns', function( rule ){
		var wrapper = getWrapper( this ),
			contract = getContract( wrapper );

		contract.returns = rule;

		return wrapper;
	});


	define( 'ensure', function( ensureFn ){
		var wrapper = getWrapper( this ),
			contract = getContract( wrapper );

		if ( contract.ensure instanceof Array )
			contract.ensure.push( ensureFn );
		else
			contract.ensure = [ensureFn];

		return wrapper;
	});

})();