import { _Math } from '../math/Math';
import { REVISION } from '../constants';


function printError( clazz, msg ){
    console.error("[OIMO] " + clazz + ": " + msg);
}

export { printError };

// A performance evaluator

function InfoDisplay(world){

    this.parent = world;

    this.infos = [];//new Float32Array( 13 );
    for( var n = 0; n < 13; n++ ) this.infos.push(0.0);
    this.f = [0,0,0];

    this.times = [0,0,0,0];

    this.broadPhase = this.parent.broadPhaseType;

    this.version = REVISION;

    this.fps = 0;

    this.tt = 0;

    this.broadPhaseTime = 0;
    this.narrowPhaseTime = 0;
    this.solvingTime = 0;
    this.totalTime = 0;
    this.updateTime = 0;

    this.MaxBroadPhaseTime = 0;
    this.MaxNarrowPhaseTime = 0;
    this.MaxSolvingTime = 0;
    this.MaxTotalTime = 0;
    this.MaxUpdateTime = 0;

    this.MinBroadPhaseTime = 0;
    this.MinNarrowPhaseTime = 0;
    this.MinSolvingTime = 0;
    this.MinTotalTime = 0;
    this.MinUpdateTime = 0;

    this.TotBroadPhaseTime = 0;
    this.TotNarrowPhaseTime = 0;
    this.TotSolvingTime = 0;
    this.TotTotalTime = 0;
    this.TotUpdateTime = 0;

};

Object.assign( InfoDisplay.prototype, {

    setTime: function(n){
        this.times[ n || 0 ] = performance.now();
    },

    resetMax: function(){

        this.MaxBroadPhaseTime = 0;
        this.MaxNarrowPhaseTime = 0;
        this.MaxSolvingTime = 0;
        this.MaxTotalTime = 0;
        this.MaxUpdateTime = 0;

        this.MinBroadPhaseTime = 100;
        this.MinNarrowPhaseTime = 100;
        this.MinSolvingTime = 100;
        this.MinTotalTime = 100;
        this.MinUpdateTime = 100;

    },

    resetAvg: function(){

        this.TotBroadPhaseTime = 0;
        this.TotNarrowPhaseTime = 0;
        this.TotSolvingTime = 0;
        this.TotTotalTime = 0;
        this.TotUpdateTime = 0;
    },

    calcBroadPhase: function () {

        this.setTime( 2 );
        this.broadPhaseTime = this.times[ 2 ] - this.times[ 1 ];

    },

    calcNarrowPhase: function () {

        this.setTime( 3 );
        this.narrowPhaseTime = this.times[ 3 ] - this.times[ 2 ];

    },

    calcEnd: function () {

        this.setTime( 2 );
        this.solvingTime = this.times[ 2 ] - this.times[ 1 ];
        this.totalTime = this.times[ 2 ] - this.times[ 0 ];
        this.updateTime = this.totalTime - ( this.broadPhaseTime + this.narrowPhaseTime + this.solvingTime );


        if( this.tt === 100 ) this.resetMax();

        this.TotBroadPhaseTime += this.broadPhaseTime;
        this.TotNarrowPhaseTime += this.narrowPhaseTime;
        this.TotSolvingTime += this.solvingTime;
        this.TotTotalTime += this.totalTime;
        this.TotUpdateTime += this.updateTime;

            if( this.broadPhaseTime > this.MaxBroadPhaseTime ) this.MaxBroadPhaseTime = this.broadPhaseTime;
            if( this.narrowPhaseTime > this.MaxNarrowPhaseTime ) this.MaxNarrowPhaseTime = this.narrowPhaseTime;
            if( this.solvingTime > this.MaxSolvingTime ) this.MaxSolvingTime = this.solvingTime;
            if( this.totalTime > this.MaxTotalTime ) this.MaxTotalTime = this.totalTime;
            if( this.updateTime > this.MaxUpdateTime ) this.MaxUpdateTime = this.updateTime;

            if( this.broadPhaseTime < this.MinBroadPhaseTime ) this.MinBroadPhaseTime = this.broadPhaseTime;
            if( this.narrowPhaseTime <this.MinNarrowPhaseTime ) this.MinNarrowPhaseTime = this.narrowPhaseTime;
            if( this.solvingTime < this.MinSolvingTime ) this.MinSolvingTime = this.solvingTime;
            if( this.totalTime < this.MinTotalTime ) this.MinTotalTime = this.totalTime;
            if( this.updateTime < this.MinUpdateTime ) this.MinUpdateTime = this.updateTime;

        this.upfps();

        this.tt ++;
        if(this.tt > 500) { this.resetAvg(); this.tt = 1; }

    },


    upfps : function(){
        this.f[1] = Date.now();
        if (this.f[1]-1000>this.f[0]){ this.f[0] = this.f[1]; this.fps = this.f[2]; this.f[2] = 0; } this.f[2]++;
    },

    show: function(){
        var info =[
            "Oimo.js "+this.version+"<br>",
            this.broadPhase + "<br><br>",
            "FPS: " + this.fps +" fps<br><br>",
            "rigidbody "+this.parent.numRigidBodies+"<br>",
            "contact &nbsp;&nbsp;"+this.parent.numContacts+"<br>",
            "ct-point &nbsp;"+this.parent.numContactPoints+"<br>",
            "paircheck "+this.parent.broadPhase.numPairChecks+"<br>",
            "island &nbsp;&nbsp;&nbsp;"+this.parent.numIslands +"<br><br>",
            "Time in milliseconds<br><br>",
            "broadphase &nbsp;"                         + _Math.fix(this.broadPhaseTime)   + " | " + _Math.fix(this.MaxBroadPhaseTime)  + " | " + _Math.fix(this.MinBroadPhaseTime)  + " | " + _Math.fix(this.TotBroadPhaseTime/this.tt)+"<br>",
            "narrowphase "                              + _Math.fix(this.narrowPhaseTime)  + " | " + _Math.fix(this.MaxNarrowPhaseTime) + " | " + _Math.fix(this.MinNarrowPhaseTime) + " | " + _Math.fix(this.TotNarrowPhaseTime/this.tt)+ "<br>",
            "solving &nbsp;&nbsp;&nbsp;&nbsp;"          + _Math.fix(this.solvingTime)      + " | " + _Math.fix(this.MaxSolvingTime)     + " | " + _Math.fix(this.MinSolvingTime)     + " | " + _Math.fix(this.TotSolvingTime/this.tt) + "<br>",
            "total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ _Math.fix(this.totalTime)        + " | " + _Math.fix(this.MaxTotalTime)       + " | " + _Math.fix(this.MinTotalTime)       + " | " + _Math.fix(this.TotTotalTime/this.tt)+ "<br>",
            "updating &nbsp;&nbsp;&nbsp;"               + _Math.fix(this.updateTime)       + " | " + _Math.fix(this.MaxUpdateTime)      + " | " + _Math.fix(this.MinUpdateTime)      + " | " + _Math.fix(this.TotUpdateTime/this.tt)+ "<br>"
        ].join("\n");
        return info;
    },

    toArray: function(){
        this.infos[0] = this.parent.broadPhase.types;
        this.infos[1] = this.parent.numRigidBodies;
        this.infos[2] = this.parent.numContacts;
        this.infos[3] = this.parent.broadPhase.numPairChecks;
        this.infos[4] = this.parent.numContactPoints;
        this.infos[5] = this.parent.numIslands;
        this.infos[6] = this.broadPhaseTime;
        this.infos[7] = this.narrowPhaseTime;
        this.infos[8] = this.solvingTime;
        this.infos[9] = this.updateTime;
        this.infos[10] = this.totalTime;
        this.infos[11] = this.fps;
        return this.infos;
    }
    
});

export { InfoDisplay };