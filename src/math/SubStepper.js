const _debug = false;

var orderedArray = [];
// 0 , ( ( n+1)*2 ) -1, ( n+1)*2

var greaterMap = [];
var lesserMap = [];


var root = null;


function store( root, value ) {
	if( !root ) 
        	return { lesser : null, greater : null, value : value };
	if( value < root.value ) {
        	if( root.lesser )
                	return store( root.lesser, value );
                else
                	return root.lesser = store( root.lesser, value );
        }
	else if( value > root.value ) {
        	if( root.greater )
                	return store( root.greater, value );
                else
                	return root.greater = store( root.greater, value );
        }
}

function split( a, b, level ) {
	if( level > 10 ) 
        	return;
	var c = (a+b)/2;
        var node = store( root, c );
        if( !root ) root = node;
        split( a, c, level + 1 );
        split( c, b, level + 1 );
}


function pullOut( root ) {
	var doLevel = 0;
	function pullOut( node, level ) {
		if( !node ) return;
		if( level > doLevel ) return;
		if( level == doLevel )
	        	orderedArray.push( node.value );
		pullOut( node.lesser, level+1 );
		pullOut( node.greater, level+1 );        
	}
	for( doLevel = 0; doLevel < 15; doLevel++ )
		pullOut( root, 0 );
}

split( 0, 1, 0 );
pullOut( root );

if( _debug ) {
console.log( "dump:", orderedArray );

console.log( "dump:", orderedArray[0] );

console.log( "dump:", orderedArray[1], orderedArray[2] );

}

// 0 , ( ( n+1)*2 ) -1, ( n+1)*2
function fillGreaterMap() {
	for( n = 0; n < orderedArray.length; n++ ) {
		greaterMap[n] = (n+1)*2;
		if( greaterMap[n] >= orderedArray.length ) break;
	}
	for( n = 0; n < orderedArray.length; n++ ) {
		lesserMap[n] = ((n+1)*2)-1;
		if( lesserMap[n] >= orderedArray.length ) break;
	}
}
fillGreaterMap();

_debug && console.log( "maps:", greaterMap.length, lesserMap.slice( 0, 20 ) );

var start = 0;
var mapPath = '';
for( var m = 0; m < 10; m++ ) {
console.log( start,":",orderedArray[start] );
if( m & 1 )  {
 	mapPath += '1';
	start = greaterMap[start];
} else {
 	mapPath += '0';
	start = lesserMap[start];
}
}

function find( val ) {
	var start = 0;
	var mapPath = '';
	var pathArr = [];
	for( var m = 0; m < 10; m++ ) {
		pathArr.push( start );
		console.log( start,":",orderedArray[start] );
		if( orderedArray[start] < val )  {
		 	mapPath += '1';
			start = greaterMap[start];
		} else if( orderedArray[start] > val ) {
	 		mapPath += '0';
			start = lesserMap[start];
		} else
			break;
	}
	return { path: mapPath, pathArr : pathArr, index:start, closest:orderedArray[start] };
}

function SubStepper( ) {
	return { index : 0, val : 0.5, next: next, after : next, prior:prior, before:prior, stepTo: stepTo, reset(){ this.index=0; this.val=0.5; } };
	function next() { if( this.index < greaterMap.length ) this.index = greaterMap[this.index]; this.val = orderedArray[this.index] }
	function prior() { if( this.index < lesserMap.length ) this.index = lesserMap[this.index]; this.val = orderedArray[this.index] }
	function stepTo(val) { var f = find( val ); this.index = f.index; this.val = f.closest }
}

if( _debug ) {
console.log( "path:", mapPath );

console.log( "find 0.123", find( 0.123 ) );
console.log( "find 0.5", find( 0.5 ) );
console.log( "find 0.14159", find( 0.14159 ) );

var stepper = SubStepper();

stepper.reset();
console.log( "stepper:", stepper.val );
stepper.before();
console.log( "stepper:", stepper.val );
stepper.after();
console.log( "stepper:", stepper.val );
stepper.before();
console.log( "stepper:", stepper.val );
stepper.before();
}

export { SubStepper };
