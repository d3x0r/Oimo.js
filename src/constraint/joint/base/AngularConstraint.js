import { Vec3 } from '../../../math/Vec3';
import { Quat } from '../../../math/Quat';
import { Mat33 } from '../../../math/Mat33';

/**
* An angular constraint for all axes for various joints.
* @author saharan
*/

function AngularConstraint( joint, targetOrientation ) {

    this.joint = joint;

    this.targetOrientation = new Quat().invert( targetOrientation );

    this.relativeOrientation = new Quat();

    this.ii1 = null;
    this.ii2 = null;
    this.dd = null;

    this.vel = new Vec3();
    this.imp = new Vec3();

    this.rn0 = new Vec3();
    this.rn1 = new Vec3();
    this.rn2 = new Vec3();

    this.b1 = joint.body1;
    this.b2 = joint.body2;
    this.a1 = this.b1.angularVelocity;
    this.a2 = this.b2.angularVelocity;
    this.i1 = this.b1.inverseInertia;
    this.i2 = this.b2.inverseInertia;

};

Object.assign( AngularConstraint.prototype, {

    AngularConstraint: true,

    preSolve: function ( timeStep, invTimeStep ) {

        var inv, len, v;

        this.ii1 = this.i1.clone();
        this.ii2 = this.i2.clone();

        v = new Mat33().add(this.ii1, this.ii2).elements;
        inv = 1/( v.e0*(v.e4*v.e8-v.e7*v.e5)  +  v.e3*(v.e7*v.e2-v.e1*v.e8)  +  v.e6*(v.e1*v.e5-v.e4*v.e2) );
        this.dd = Mat33.new().set(
            (v.e4*v.e8-v.e5*v.e7)*inv, (v.e2*v.e7-v.e1*v.e8)*inv, (v.e1*v.e5-v.e2*v.e4)*inv,
            (v.e5*v.e6-v.e3*v.e8)*inv, (v.e0*v.e8-v.e2*v.e6)*inv, (v.e2*v.e3-v.e0*v.e5)*inv,
            (v.e3*v.e7-v.e4*v.e6)*inv, (v.e1*v.e6-v.e0*v.e7)*inv, (v.e0*v.e4-v.e1*v.e3)*inv
        );//.multiplyScalar( inv );
        
        this.relativeOrientation.invert( this.b1.orientation ).multiply( this.targetOrientation ).multiply( this.b2.orientation );

        inv = this.relativeOrientation.w*2;

        this.vel.copy( this.relativeOrientation ).multiplyScalar( inv );

        len = this.vel.length();

        if( len > 0.02 ) {
            len = (0.02-len)/len*invTimeStep*0.05;
            this.vel.multiplyScalar( len );
        }else{
            this.vel.set(0,0,0);
        }

        this.rn1.copy( this.imp ).applyMatrix3( this.ii1, true );
        this.rn2.copy( this.imp ).applyMatrix3( this.ii2, true );

        this.a1.add( this.rn1 );
        this.a2.sub( this.rn2 );

    },

    solve: function () {
        var tmp;
        var r = ( tmp = this.a2.clone() ).sub( this.a1 ).sub( this.vel );

        this.rn0.copy( r ).applyMatrix3( this.dd, true );
        this.rn1.copy( this.rn0 ).applyMatrix3( this.ii1, true );
        this.rn2.copy( this.rn0 ).applyMatrix3( this.ii2, true );

        this.imp.add( this.rn0 );
        this.a1.add( this.rn1 );
        this.a2.sub( this.rn2 );

        this.ii1.delete();
        this.ii2.delete();
        tmp.delete();
	this.dd.delete();
    }

} );

export { AngularConstraint };