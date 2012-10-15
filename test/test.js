/**
 * @author Marenin Alexander
 * October 2012
 */

test( 'Test expect', function(){
    var inc = (function( n ){
            return n + 1
        }).expects( 'number' );


    try {

    }
    catch ( e ){
        ok( e instanceof Error );
    }
});