import { _Math } from './Math';
import { Vec3 } from './Vec3';

function Mat33 ( e00, e01, e02, e10, e11, e12, e20, e21, e22 ){

    this.elements = {
        e0:1, e1:0, e2:0,
        e3:0, e4:1, e5:0,
        e6:0, e7:0, e8:1
    };

    //this.elements = [
    //    1, 0, 0,
    //    0, 1, 0,
    //    0, 0, 1
    //];

    if ( arguments.length > 0 ) {

        console.error( 'OIMO.Mat33: the constructor no longer reads arguments. use .set() instead.' );

    }

}

var pool = [];

Mat33.new = function() {
    var c = pool.pop();
    if( !c ) c = new Mat33();
    return c;
}

Object.assign( Mat33.prototype, {

    Mat33: true,

    set: function ( e00, e01, e02, e10, e11, e12, e20, e21, e22 ){

        var te = this.elements;
        te.e0 = e00; te.e1 = e01; te.e2 = e02;
        te.e3 = e10; te.e4 = e11; te.e5 = e12;
        te.e6 = e20; te.e7 = e21; te.e8 = e22;
        return this;

    },
    
    add: function ( a, b ) {

        if( b !== undefined ) return this.addMatrixs( a, b );

        var e = this.elements, te = a.elements;
        e.e0 += te.e0; e.e1 += te.e1; e.e2 += te.e2;
        e.e3 += te.e3; e.e4 += te.e4; e.e5 += te.e5;
        e.e6 += te.e6; e.e7 += te.e7; e.e8 += te.e8;
        return this;

    },

    addMatrixs: function ( a, b ) {

        var te = this.elements, tem1 = a.elements, tem2 = b.elements;
        te.e0 = tem1.e0 + tem2.e0; te.e1 = tem1.e1 + tem2.e1; te.e2 = tem1.e2 + tem2.e2;
        te.e3 = tem1.e3 + tem2.e3; te.e4 = tem1.e4 + tem2.e4; te.e5 = tem1.e5 + tem2.e5;
        te.e6 = tem1.e6 + tem2.e6; te.e7 = tem1.e7 + tem2.e7; te.e8 = tem1.e8 + tem2.e8;
        return this;

    },

    addEqual: function( m ){

        var te = this.elements, tem = m.elements;
        te.e0 += tem.e0; te.e1 += tem.e1; te.e2 += tem.e2;
        te.e3 += tem.e3; te.e4 += tem.e4; te.e5 += tem.e5;
        te.e6 += tem.e6; te.e7 += tem.e7; te.e8 += tem.e8;
        return this;

    },

    sub: function ( a, b ) {

        if( b !== undefined ) return this.subMatrixs( a, b );

        var e = this.elements, te = a.elements;
        e.e0 -= te.e0; e.e1 -= te.e1; e.e2 -= te.e2;
        e.e3 -= te.e3; e.e4 -= te.e4; e.e5 -= te.e5;
        e.e6 -= te.e6; e.e7 -= te.e7; e.e8 -= te.e8;
        return this;

    },

    subMatrixs: function ( a, b ) {

        var te = this.elements, tem1 = a.elements, tem2 = b.elements;
        te.e0 = tem1.e0 - tem2.e0; te.e1 = tem1.e1 - tem2.e1; te.e2 = tem1.e2 - tem2.e2;
        te.e3 = tem1.e3 - tem2.e3; te.e4 = tem1.e4 - tem2.e4; te.e5 = tem1.e5 - tem2.e5;
        te.e6 = tem1.e6 - tem2.e6; te.e7 = tem1.e7 - tem2.e7; te.e8 = tem1.e8 - tem2.e8;
        return this;

    },

    subEqual: function ( m ) {

        var te = this.elements, tem = m.elements;
        te.e0 -= tem.e0; te.e1 -= tem.e1; te.e2 -= tem.e2;
        te.e3 -= tem.e3; te.e4 -= tem.e4; te.e5 -= tem.e5;
        te.e6 -= tem.e6; te.e7 -= tem.e7; te.e8 -= tem.e8;
        return this;

    },

    scale: function ( m, s ) {

        var te = this.elements, tm = m.elements;
        te.e0 = tm.e0 * s; te.e1 = tm.e1 * s; te.e2 = tm.e2 * s;
        te.e3 = tm.e3 * s; te.e4 = tm.e4 * s; te.e5 = tm.e5 * s;
        te.e6 = tm.e6 * s; te.e7 = tm.e7 * s; te.e8 = tm.e8 * s;
        return this;

    },

    scaleEqual: function ( s ){// multiplyScalar

        var te = this.elements;
        te.e0 *= s; te.e1 *= s; te.e2 *= s;
        te.e3 *= s; te.e4 *= s; te.e5 *= s;
        te.e6 *= s; te.e7 *= s; te.e8 *= s;
        return this;

    },

    multiplyMatrices: function ( m1, m2, transpose ) {

        if( transpose ) m2 = m2.clone().transpose();

        var te = this.elements;
        var tm1 = m1.elements;
        var tm2 = m2.elements;

        var a0 = tm1.e0, a3 = tm1.e3, a6 = tm1.e6;
        var a1 = tm1.e1, a4 = tm1.e4, a7 = tm1.e7;
        var a2 = tm1.e2, a5 = tm1.e5, a8 = tm1.e8;

        var b0 = tm2.e0, b3 = tm2.e3, b6 = tm2.e6;
        var b1 = tm2.e1, b4 = tm2.e4, b7 = tm2.e7;
        var b2 = tm2.e2, b5 = tm2.e5, b8 = tm2.e8;

        te.e0 = a0*b0 + a1*b3 + a2*b6;
        te.e1 = a0*b1 + a1*b4 + a2*b7;
        te.e2 = a0*b2 + a1*b5 + a2*b8;
        te.e3 = a3*b0 + a4*b3 + a5*b6;
        te.e4 = a3*b1 + a4*b4 + a5*b7;
        te.e5 = a3*b2 + a4*b5 + a5*b8;
        te.e6 = a6*b0 + a7*b3 + a8*b6;
        te.e7 = a6*b1 + a7*b4 + a8*b7;
        te.e8 = a6*b2 + a7*b5 + a8*b8;

        if( transpose ) m2.delete();

        return this;

    },

    /*mul: function ( m1, m2, transpose ) {

        if( transpose ) m2 = m2.clone().transpose();

        var te = this.elements;
        var tm1 = m1.elements;
        var tm2 = m2.elements;
        //var tmp;

        var a0 = tm1.e0, a3 = tm1.e3, a6 = tm1.e6;
        var a1 = tm1.e1, a4 = tm1.e4, a7 = tm1.e7;
        var a2 = tm1.e2, a5 = tm1.e5, a8 = tm1.e8;

        var b0 = tm2.e0, b3 = tm2.e3, b6 = tm2.e6;
        var b1 = tm2.e1, b4 = tm2.e4, b7 = tm2.e7;
        var b2 = tm2.e2, b5 = tm2.e5, b8 = tm2.e8;

        /*if( transpose ){

            tmp = b1; b1 = b3; b3 = tmp;
            tmp = b2; b2 = b6; b6 = tmp;
            tmp = b5; b5 = b7; b7 = tmp;

        }

        te.e0 = a0*b0 + a1*b3 + a2*b6;
        te.e1 = a0*b1 + a1*b4 + a2*b7;
        te.e2 = a0*b2 + a1*b5 + a2*b8;
        te.e3 = a3*b0 + a4*b3 + a5*b6;
        te.e4 = a3*b1 + a4*b4 + a5*b7;
        te.e5 = a3*b2 + a4*b5 + a5*b8;
        te.e6 = a6*b0 + a7*b3 + a8*b6;
        te.e7 = a6*b1 + a7*b4 + a8*b7;
        te.e8 = a6*b2 + a7*b5 + a8*b8;

        return this;

    },*/

    transpose: function ( m ) {
        
        if( m !== undefined ){
            var a = m.elements;
            this.set( a.e0, a.e3, a.e6, a.e1, a.e4, a.e7, a.e2, a.e5, a.e8 );
            return this;
        }

        var te = this.elements;
        var a01 = te.e1, a02 = te.e2, a12 = te.e5;
        te.e1 = te.e3;
        te.e2 = te.e6;
        te.e3 = a01;
        te.e5 = te.e7;
        te.e6 = a02;
        te.e7 = a12;
        return this;

    },



    /*mulScale: function ( m, sx, sy, sz, Prepend ) {

        var prepend = Prepend || false;
        var te = this.elements, tm = m.elements;
        if(prepend){
            te.e0 = sx*tm.e0; te.e1 = sx*tm.e1; te.e2 = sx*tm.e2;
            te.e3 = sy*tm.e3; te.e4 = sy*tm.e4; te.e5 = sy*tm.e5;
            te.e6 = sz*tm.e6; te.e7 = sz*tm.e7; te.e8 = sz*tm.e8;
        }else{
            te.e0 = tm.e0*sx; te.e1 = tm.e1*sy; te.e2 = tm.e2*sz;
            te.e3 = tm.e3*sx; te.e4 = tm.e4*sy; te.e5 = tm.e5*sz;
            te.e6 = tm.e6*sx; te.e7 = tm.e7*sy; te.e8 = tm.e8*sz;
        }
        return this;

    },

    transpose: function ( m ) {

        var te = this.elements, tm = m.elements;
        te.e0 = tm.e0; te.e1 = tm.e3; te.e2 = tm.e6;
        te.e3 = tm.e1; te.e4 = tm.e4; te.e5 = tm.e7;
        te.e6 = tm.e2; te.e7 = tm.e5; te.e8 = tm.e8;
        return this;

    },*/

    setQuat: function ( q ) {

        var te = this.elements;
        var x = q.x, y = q.y, z = q.z, w = q.w;
        var x2 = x + x,  y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        
        te.e0 = 1 - ( yy + zz );
        te.e1 = xy - wz;
        te.e2 = xz + wy;

        te.e3 = xy + wz;
        te.e4 = 1 - ( xx + zz );
        te.e5 = yz - wx;

        te.e6 = xz - wy;
        te.e7 = yz + wx;
        te.e8 = 1 - ( xx + yy );

        return this;

    },

    invert: function( m ) {

        var te = this.elements, tm = m.elements,
        a00 = tm.e0, a10 = tm.e3, a20 = tm.e6,
        a01 = tm.e1, a11 = tm.e4, a21 = tm.e7,
        a02 = tm.e2, a12 = tm.e5, a22 = tm.e8,
        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,
        det = a00 * b01 + a01 * b11 + a02 * b21;

        if ( det === 0 ) {
            console.log( "can't invert matrix, determinant is 0");
            return this.identity();
        }

        det = 1.0 / det;
        te.e0 = b01 * det;
        te.e1 = (-a22 * a01 + a02 * a21) * det;
        te.e2 = (a12 * a01 - a02 * a11) * det;
        te.e3 = b11 * det;
        te.e4 = (a22 * a00 - a02 * a20) * det;
        te.e5 = (-a12 * a00 + a02 * a10) * det;
        te.e6 = b21 * det;
        te.e7 = (-a21 * a00 + a01 * a20) * det;
        te.e8 = (a11 * a00 - a01 * a10) * det;
        return this;

    },

    addOffset: function ( m, v ) {

        var relX = v.x;
        var relY = v.y;
        var relZ = v.z;

        var te = this.elements;
        te.e0 += m * ( relY * relY + relZ * relZ );
        te.e4 += m * ( relX * relX + relZ * relZ );
        te.e8 += m * ( relX * relX + relY * relY );
        var xy = m * relX * relY;
        var yz = m * relY * relZ;
        var zx = m * relZ * relX;
        te.e1 -= xy;
        te.e3 -= xy;
        te.e2 -= yz;
        te.e6 -= yz;
        te.e5 -= zx;
        te.e7 -= zx;
        return this;

    },

    subOffset: function ( m, v ) {

        var relX = v.x;
        var relY = v.y;
        var relZ = v.z;

        var te = this.elements;
        te.e0 -= m * ( relY * relY + relZ * relZ );
        te.e4 -= m * ( relX * relX + relZ * relZ );
        te.e8 -= m * ( relX * relX + relY * relY );
        var xy = m * relX * relY;
        var yz = m * relY * relZ;
        var zx = m * relZ * relX;
        te.e1 += xy;
        te.e3 += xy;
        te.e2 += yz;
        te.e6 += yz;
        te.e5 += zx;
        te.e7 += zx;
        return this;

    },

    // OK 

    multiplyScalar: function ( s ) {

        var te = this.elements;

        te.e0 *= s; te.e3 *= s; te.e6 *= s;
        te.e1 *= s; te.e4 *= s; te.e7 *= s;
        te.e2 *= s; te.e5 *= s; te.e8 *= s;

        return this;

    },

    identity: function () {

        this.set( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
        return this;

    },


    clone: function () {
        var c = pool.pop();
        if( !c ) c = new Mat33();
	c.copy( this );
	return c;
    },

    delete : function() {
        pool.push( this );
    },

    copy: function ( m ) {
	let el2 = m.elements;
	let el1 = this.elements;
	el1.e0 = el2.e0;
	el1.e1 = el2.e1;
	el1.e2 = el2.e2;
	el1.e3 = el2.e3;
	el1.e4 = el2.e4;
	el1.e5 = el2.e5;
	el1.e6 = el2.e6;
	el1.e7 = el2.e7;
	el1.e8 = el2.e8;
        //for ( var i = 0; i < 9; i ++ ) this.elements[ 'e'+i ] = m.elements[ 'e'+i ];
        return this;

    },

    determinant: function () {

        var te = this.elements;
        var a = te.e0, b = te.e1, c = te.e2,
            d = te.e3, e = te.e4, f = te.e5,
            g = te.e6, h = te.e7, i = te.e8;

        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        for( var i = 0; i < 9; i ++ ) {

            this.elements[ 'e'+i ] = array[ i + offset ];

        }

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        var te = this.elements;

        array[ offset ] = te.e0;
        array[ offset + 1 ] = te.e1;
        array[ offset + 2 ] = te.e2;

        array[ offset + 3 ] = te.e3;
        array[ offset + 4 ] = te.e4;
        array[ offset + 5 ] = te.e5;

        array[ offset + 6 ] = te.e6;
        array[ offset + 7 ] = te.e7;
        array[ offset + 8 ] = te.e8;

        return array;

    }


} );

export { Mat33 };