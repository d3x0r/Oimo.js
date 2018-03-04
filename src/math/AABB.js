import { _Math } from './Math';
import { Vec3 } from './Vec3';
import {ContactManifold} from '../constraint/contact/ContactManifold';
import {CylinderCylinderCollisionDetector} from '../collision/narrowphase/CylinderCylinderCollisionDetector'
import {Cylinder} from '../shape/Cylinder'
import {ShapeConfig} from '../shape/ShapeConfig'
/**
 * An axis-aligned bounding box.
 *
 * @author saharan
 * @author lo-th
 */

 var makingCCD = false;
function AABB( minX, maxX, minY, maxY, minZ, maxZ ){
	if( makingCCD )
		return;
	this.center = new Vec3();
	this.radius = 0;
	makingCCD = true;
	this.ccdShape = new Cylinder( new ShapeConfig(), 1, 1 );
	makingCCD = false;
	
    this.aabb_elements = { e0:0,e1:0,e2:0,e3:0,e4:0,e6:0}// new Float32Array( 6 );
    var te = this.aabb_elements;


    te.e0 = minX || 0; te.e1 = minY || 0; te.e2 = minZ || 0;
    te.e3 = maxX || 0; te.e4 = maxY || 0; te.e5 = maxZ || 0;

};

const ccdDetector = new CylinderCylinderCollisionDetector();
const ccdManifold = new ContactManifold();



Object.assign( AABB.prototype, {

	AABB: true,

	set: function(minX, maxX, minY, maxY, minZ, maxZ){

		var te = this.aabb_elements;
		te.e0 = minX;
		te.e3 = maxX;
		te.e1 = minY;
		te.e4 = maxY;
		te.e2 = minZ;
		te.e5 = maxZ;
		var x = (maxX + minX)/2, y = ( maxY + minY)/2, z =( maxZ + minZ)/2;
		var hx = maxX - x, hy = maxY - y, hz = maxZ - z;
		this.center.set( x, y, z );
		
		if( hx < hy ) {
			hx = hy; x = y;
		}
		if( hx < hz ) {
			hx = hz; x = z;
		}
		this.radius = hx;
		return this;
	},

	intersectTest: function ( aabb ) {
		ccdManifold.reset( this.ccdShape, aabb.ccdShape );
		if( ccdDetector.detectCollision( this.ccdShape, aabb.ccdShape, ccdManifold ) || ccdManifold.numPoints) {
			//console.log( "... cylinder collided... ", ccdManifold.numPoints)
			return true;
		}
		var te = this.aabb_elements;
		var ue = aabb.aabb_elements;
		return te.e0 > ue.e3 || te.e1 > ue.e4 || te.e2 > ue.e5 || te.e3 < ue.e0 || te.e4 < ue.e1 || te.e5 < ue.e2 ? true : false;

	},


    updateCCD( body, delta ) {
		this.ccdShape.parent = body;
        this.ccdShape.position.copy( body.position ).addScaledVector( body.continuousLinearVelocity, this.ccdShape.halfHeight = delta/2 );;
		this.ccdShape.normalDirection.copy( body.continuousLinearVelocity );
		this.ccdShape.halfHeight = ( this.ccdShape.height = this.ccdShape.normalDirection.length() ) /2;
		this.ccdShape.normalDirection.normalize();
        this.ccdShape.radius = this.radius;
    },

	intersectTestTwo: function ( aabb ) {

		var te = this.aabb_elements;
		var ue = aabb.aabb_elements;
		return te.e0 < ue.e0 || te.e1 < ue.e1 || te.e2 < ue.e2 || te.e3 > ue.e3 || te.e4 > ue.e4 || te.e5 > ue.e5 ? true : false;

	},

	clone: function () {

		return new this.constructor().fromArray( this.aabb_elements );

	},

	copy: function ( aabb, margin ) {

		var m = margin || 0;
		var me = aabb.aabb_elements;
		this.set( me.e0-m, me.e3+m, me.e1-m, me.e4+m, me.e2-m, me.e5+m );
		return this;

	},

	fromArray: function ( array ) {

		this.aabb_elements.set( array );
		return this;

	},

	// Set this AABB to the combined AABB of aabb1 and aabb2.

	combine: function( aabb1, aabb2 ) {

		var a = aabb1.aabb_elements;
		var b = aabb2.aabb_elements;
		var te = this.aabb_elements;

		te.e0 = a.e0 < b.e0 ? a.e0 : b.e0;
		te.e1 = a.e1 < b.e1 ? a.e1 : b.e1;
		te.e2 = a.e2 < b.e2 ? a.e2 : b.e2;

		te.e3 = a.e3 > b.e3 ? a.e3 : b.e3;
		te.e4 = a.e4 > b.e4 ? a.e4 : b.e4;
		te.e5 = a.e5 > b.e5 ? a.e5 : b.e5;

		return this;

	},


	// Get the surface area.

	surfaceArea: function () {

		var te = this.aabb_elements;
		var a = te.e3 - te.e0;
		var h = te.e4 - te.e1;
		var d = te.e5 - te.e2;
		return 2 * (a * (h + d) + h * d );

	},


	// Get whether the AABB intersects with the point or not.

	intersectsWithPoint:function(x,y,z){

		var te = this.aabb_elements;
		return x>=te.e0 && x<=te.e3 && y>=te.e1 && y<=te.e4 && z>=te.e2 && z<=te.e5;

	},

	/**
	 * Set the AABB from an array
	 * of vertices. From THREE.
	 * @author WestLangley
	 * @author xprogram
	 */

	setFromPoints: function(arr){
		this.makeEmpty();
		for(var i = 0; i < arr.length; i++){
			this.expandByPoint(arr[i]);
		}
		
		var te = this.aabb_elements;
		var x = (te.e3 + te.e0)/2, y = ( te.e4 + te.e1)/2, z =( te.e5 + te.e2)/2;
		var hx = maxX - x, hy = maxY= y, hz = maxZ - z;
		this.center.set( x, y, z );
		
		if( hx < hy ) {
			hx = hy; x = y;
		}
		if( hx < hz ) {
			hx = hz; x = z;
		}
		this.radius = hx;
	},

	makeEmpty: function(){
		this.set(-Infinity, -Infinity, -Infinity, Infinity, Infinity, Infinity);
	},

	expandByPoint: function(pt){
		var te = this.aabb_elements;
		this.set(
			_Math.min(te.e0, pt.x), _Math.min(te.e1, pt.y), _Math.min(te.e2, pt.z),
			_Math.max(te.e3, pt.x), _Math.max(te.e4, pt.y), _Math.max(te.e5, pt.z)
		);
	},

	expandByScalar: function(s){

		var te = this.aabb_elements;
		te.e0 += -s;
		te.e1 += -s;
		te.e2 += -s;
		te.e3 += s;
		te.e4 += s;
		te.e5 += s;
	}

});

export { AABB };