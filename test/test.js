/**
 * @author Marenin Alexander
 * October 2012
 */

test( 'check for availability of methods', function(){
	var fp = Function.prototype;
	ok( fp.expect, 'Method "expect" exist' );
	ok( fp.require, 'Method "require" exist' );
	ok( fp.returns, 'Method "returns" exist' );
	ok( fp.ensure, 'Method "ensure" exist' );
});


module( '".expect()" method' );

test( 'Check expectations', function(){
	var fn = (function( a, b ){
			return a + b;
		})
		.expect( 'number', 'number' );

	equal( fn(1, 2), 3, 'Checks with correct parameters' );

	try {
		fn( 1 );
		ok( false, 'impossible' );
	}
	catch ( e ){
		ok( e instanceof Contract.ViolationError, 'Checks for wrong quantity of parameters' );
	}

	try {
		fn( 'ololo', 2 );
		ok( false, 'impossible' );
	}
	catch ( e ){
		ok( e instanceof Contract.ViolationError, 'Checks for wrong type of parameters' );
	}
});


test( 'String test', function(){
	var fnString = (function( str ){ return str + 'yeah'; }).expect( 'string' );

	equal( fnString('oh, '), 'oh, yeah', 'Checks for string parameter' );

	try {
		fnString( {} );
		ok( false, 'impossible' );
	}
	catch ( e ){
		ok( e instanceof Contract.ViolationError, 'Checks for error type' );
	}
});


test( 'Array test', function(){
	var fnArray = (function( a ){ return a.reverse(); }).expect( 'array' );

	deepEqual( fnArray([1, 2]), [2, 1], 'Checks for array parameter' );

	try {
		fnArray( {} );
		ok( false, 'impossible' );
	}
	catch ( e ){
		ok( e instanceof Contract.ViolationError, 'Checks for error type' );
	}
});


test( 'Object test', function(){
	var fnObject = (function( o ){ return o; }).expect( 'object' );

	deepEqual( fnObject({p: 2}), {p: 2}, 'Checks for object parameter' );

	try {
		fnObject( 100 );
		ok( false, 'impossible' );
	}
	catch ( e ){
		ok( e instanceof Contract.ViolationError, 'Checks for error type' );
	}
});


test( 'arrayLike test', function(){
	var fnArrayLike = (function( o ){ return [].join.call(o); }).expect( 'arrayLike' ),
		alObj = {
			0: 1,
			length: 1
		};

	equal( fnArrayLike(alObj), '1', 'Checks for arrayLike parameter' );

	try {
		fnArrayLike( {} );
		ok( false, 'impossible' );
	}
	catch ( e ){
		ok( e instanceof Contract.ViolationError, 'Checks for error type' );
	}
});
