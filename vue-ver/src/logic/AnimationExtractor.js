import * as THREE from 'three/build/three.module.js'

export function MotorMovementFromAnimation(object){
    const tracks = object.animations[0].tracks;
    const quaternionTracks = tracks.filter( track=> track instanceof THREE.QuaternionKeyframeTrack)
    
    let movement = quaternionTracks.map( (track)=>{
             let angles = []
             for(let i = 0; i<track.values.length; i+=4){
                let x,y,z,w;
                [x,y,z,w] = track.values.slice(i,i+4)
                let q = new THREE.Quaternion(x,y,z,w)
                //get euler angle from quaternion angle in keyframe animations
                let rotation = new THREE.Euler().setFromQuaternion(q,'XYZ')

                // motor only has the Z-rotation
                angles.push(rotation.z)
             }
             let name = track.name.substring(0, track.name.indexOf(".quaternion"))
             return {
                 createInterpolant : track.createInterpolant,
                 name : name,
                 numOfFrames : angles.length,
                 times : track.times,
                 values : angles, // [radian]
             }
        }
    )
    return movement
}

export function sort2FrameMovement(movement){
    // sort movement by keyframe
    // index 0 means names
    // i element of 'a' array means rotation of i-th motor

    // structure : (assumptions : #of motors => N, #of frames => M)
    // angleName1,  angleName2, angleName3  ... ,   angleNameN  
    // angle1-1,    angle1-2,   angle1-3,   ... ,   angle1-N
    // angle2-1,    angle2-2,   angle2-3,   ... ,   angle2-N
    // ...
    // angleM-1,    angleM-2,   angleM-3,   ... ,   angleM-N    
    // 
    // it looks like M by N matrix

    let frameMovments = [];
    const frameNum = movement[0].numOfFrames;
    let names = movement.map( val=>val.name);
    frameMovments.push(names)
    for(let i=0; i< frameNum; i++){
        let angles = movement.map( (m)=>m.values[i] );
        frameMovments.push(angles);
    }
    return frameMovments
}

export function genearteStringFromMovements(movementStates){
    // save rotation values in txt file to read it from SD card
    // each line means motors' movements in '1' keyframe
    // --

}