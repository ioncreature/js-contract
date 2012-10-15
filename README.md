js-contract
===========

JavaScript Design By Contract implementation

Using
<pre><code class="javascript">
var sqrt = (function( x ){ return Math.sqrt(x); })
    .expect( 'number' )
    .require( function( x ){ return x >= 0; } )
    .returns( 'number' )
    .ensure( function( res ){ return res >= 0; } );

sqrt( 1 ) // => 1
sqrt( -1 ) // => Contract.ViolationError
sqrt( 'hello' ) // => Contract.ViolationError
<code></pre>