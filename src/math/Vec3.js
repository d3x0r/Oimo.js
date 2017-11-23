"use strict";
import { _Math } from './Math';

function Vec3 ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
}

Vec3.clone = function( v ) {
        var vec = pool.pop() || new Vec3();
	vec.x = v.x;
	vec.y = v.y;
	vec.z = v.z;
	return vec;
}
Vec3.cloneScale = function( v, s ) {
        var vec = pool.pop() || new Vec3();
	vec.x = v.x * s;
	vec.y = v.y * s;
	vec.z = v.z * s;
	return vec;
}

var pool = [];

Vec3.new = function() {
    var v = pool.pop();
    if( !v ) v = new Vec3();
    else v.x = v.y = v.z = 0;
    return v;
}

Object.assign( Vec3.prototype, {

    Vec3: true,

    set: function( x, y, z ){

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    },
    delete() {
        pool.push( this );
    },
    map: function(cb) {
        return [cb(this.x),cb(this.y),cb(this.z)];
    },
    add: function ( a, b ) {

        if ( b !== undefined ) return this.addVectors( a, b );

        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;

    },

    addEqual: function ( v ) {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;

    },

    sub: function ( a, b ) {

        if ( b !== undefined ) return this.subVectors( a, b );

        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;

    },

    subEqual: function ( v ) {

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;

    },

    scale: function ( v, s ) {

        this.x = v.x * s;
        this.y = v.y * s;
        this.z = v.z * s;
        return this;

    },

    scaleEqual: function( s ){

        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;

    },

    multiply: function( v ){

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;

    },

    multiplyScalar: function( s ){

        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;

    },

    /*scaleV: function( v ){

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;

    },

    scaleVectorEqual: function( v ){

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;

    },*/

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;

        return this;

    },
    addAveragedScaledVector: function ( v, v2, s ) {

        this.x += ( v2.x + v.x ) * 0.5 * s;
        this.y += ( v2.y + v.y ) * 0.5 * s;
        this.z += ( v2.z + v.z ) * 0.5 * s;

        return this;

    },
    subScaledVector: function ( v, s ) {

        this.x -= v.x * s;
        this.y -= v.y * s;
        this.z -= v.z * s;

        return this;

    },

    /*addTime: function ( v, t ) {

        this.x += v.x * t;
        this.y += v.y * t;
        this.z += v.z * t;
        return this;

    },
    
    addScale: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;

    },

    subScale: function ( v, s ) {

        this.x -= v.x * s;
        this.y -= v.y * s;
        this.z -= v.z * s;
        return this;

    },*/
   
    cross: function( a, b ) {

        if ( b !== undefined ) return this.crossVectors( a, b );

        var x = this.x, y = this.y, z = this.z;

        this.x = y * a.z - z * a.y;
        this.y = z * a.x - x * a.z;
        this.z = x * a.y - y * a.x;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    tangent: function ( a ) {

        var ax = a.x, ay = a.y, az = a.z;

        this.x = ay * ax - az * az;
        this.y = - az * ay - ax * ax;
        this.z = ax * az + ay * ay;

        return this;

    },

    

    

    invert: function ( v ) {

        this.x=-v.x;
        this.y=-v.y;
        this.z=-v.z;
        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    addition: function () {

        return this.x + this.y + this.z;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

        return _Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    },

    copy: function( v ){

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;

    },

    applyMatrix3: function ( m, transpose ) {

        //if( transpose ) m = m.clone().transpose();
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;

        if( transpose ){
            
            this.x = e.e0 * x + e.e1 * y + e.e2 * z;
            this.y = e.e3 * x + e.e4 * y + e.e5 * z;
            this.z = e.e6 * x + e.e7 * y + e.e8 * z;

        } else {
      
            this.x = e.e0 * x + e.e3 * y + e.e6 * z;
            this.y = e.e1 * x + e.e4 * y + e.e7 * z;
            this.z = e.e2 * x + e.e5 * y + e.e8 * z;
        }

        return this;

    },

    applyQuaternion: function ( q ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vector

        var ix =  qw * x + qy * z - qz * y;
        var iy =  qw * y + qz * x - qx * z;
        var iz =  qw * z + qx * y - qy * x;
        var iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;

    },

    testZero: function () {

        if(this.x!==0 || this.y!==0 || this.z!==0) return true;
        else return false;

    },

    testDiff: function( v ){

        return this.equals( v ) ? false : true;

    },

    equals: function ( v ) {

        return v.x === this.x && v.y === this.y && v.z === this.z;

    },

    clone: function () {

        return new this.constructor( this.x, this.y, this.z );

    },

    toString: function(){

        return"Vec3["+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+"]";
        
    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    toArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;

    },

    fromArray: function( array, offset ){

        if ( offset === undefined ) offset = 0;
        
        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];
        return this;

    },


} );

export { Vec3 };