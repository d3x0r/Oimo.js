import { lnQuat } from '../math/lnQuat';

/**
 * This class holds mass information of a shape.
 * @author lo-th
 * @author saharan
 */

function MassInfo (){

    // Mass of the shape.
    this.mass = 0;

    // The moment inertia of the shape.
    this.inertia = new lnQuat();

};

export { MassInfo };