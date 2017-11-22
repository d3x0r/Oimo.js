import { Proxy } from '../Proxy';
import { SAPElement } from './SAPElement';

/**
 * A proxy for sweep and prune broad-phase.
 * @author saharan
 * @author lo-th
 */

function SAPProxy ( sap, shape ){

    Proxy.call( this, shape );
    // Type of the axis to which the proxy belongs to. [0:none, 1:dynamic, 2:static]
    this.belongsTo = 0;
    // The maximum elements on each axis.
    this.max = { e0: null, e1: null, e2: null };
    // The minimum elements on each axis.
    this.min = { e0: null, e1: null, e2: null };
    
    this.sap = sap;
    this.min.e0 = new SAPElement( this, false );
    this.max.e0 = new SAPElement( this, true );
    this.min.e1 = new SAPElement( this, false );
    this.max.e1 = new SAPElement( this, true );
    this.min.e2 = new SAPElement( this, false );
    this.max.e2 = new SAPElement( this, true );
    this.max.e0.pair = this.min.e0;
    this.max.e1.pair = this.min.e1;
    this.max.e2.pair = this.min.e2;
    this.min.e0.min1 = this.min.e1;
    this.min.e0.max1 = this.max.e1;
    this.min.e0.min2 = this.min.e2;
    this.min.e0.max2 = this.max.e2;
    this.min.e1.min1 = this.min.e0;
    this.min.e1.max1 = this.max.e0;
    this.min.e1.min2 = this.min.e2;
    this.min.e1.max2 = this.max.e2;
    this.min.e2.min1 = this.min.e0;
    this.min.e2.max1 = this.max.e0;
    this.min.e2.min2 = this.min.e1;
    this.min.e2.max2 = this.max.e1;

};

SAPProxy.prototype = Object.assign( Object.create( Proxy.prototype ), {

    constructor: SAPProxy,


    // Returns whether the proxy is dynamic or not.
    isDynamic: function () {

        var body = this.shape.parent;
        return body.isDynamic && !body.sleeping;

    },

    update: function () {

        var te = this.aabb.aabb_elements;
        this.min.e0.value = te.e0;
        this.min.e1.value = te.e1;
        this.min.e2.value = te.e2;
        this.max.e0.value = te.e3;
        this.max.e1.value = te.e4;
        this.max.e2.value = te.e5;

        if( this.belongsTo == 1 && !this.isDynamic() || this.belongsTo == 2 && this.isDynamic() ){
            this.sap.removeProxy(this);
            this.sap.addProxy(this);
        }

    }

});

export { SAPProxy };