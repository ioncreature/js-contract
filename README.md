js-contract
===========

JavaScript Design By Contract implementation

== Using
<code class="javascript">
var sqrt = (function( x ){ return Math.sqrt(x); })
    .expect( 'number' )
    .require( function( x ){ return x >= 0; } )
    .returns( 'number' )
    .ensure( function( res ){ return res >= 0; } );

sqrt( 1 ) // => 1
sqrt( -1 ) // => TypeError
sqrt( 'hello' ) // => TypeError
<code>