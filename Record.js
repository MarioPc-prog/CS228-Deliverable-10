var controllerOptions = {};
var previousNumHands = 0 ;
var currentNumHands = 0;
var numSamples = 100;
var currentSamples = 0;
var FramesOfData = nj.zeros([5,4,6,numSamples]);
nj.config.printThreshold = 1000;


//creates the black snap 
function RecordData(){
    if (currentNumHands===2){
        currentSamples++;
        
    if (currentSamples === numSamples){
        currentSamples = 0;
    }
}
    if(previousNumHands===2 && currentNumHands === 1){
        background('#222222');
        console.log(FramesOfData.toString() );
        //console.log(FramesOfData.toString() );
        //console.log(currentSamples);
       
    }
}
function HandleBone(bone,thick,stroke,fingerIndex,interactionBox){
    //the distal end of the bone closest to the finger tip .nextJoint
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);
    //create new varaibles x , y , z , x1, y1, z1 , set to the nextJoint and PrevJoint 
    x = normalizedPrevJoint[0];
    y = normalizedPrevJoint[1];
    z = normalizedPrevJoint[2];
    x1 = normalizedNextJoint[0];
    y1 = normalizedNextJoint[1];
    z1 = normalizedNextJoint[2];
     
//    FramesOfData.set(fingerIndex.type,bone.type,0,currentSamples,x);
//    FramesOfData.set(fingerIndex.type,bone.type,1,currentSamples,y);
//    FramesOfData.set(fingerIndex.type,bone.type,2,currentSamples,z);
//    FramesOfData.set(fingerIndex.type,bone.type,3,currentSamples,x1);
//    FramesOfData.set(fingerIndex.type,bone.type,4,currentSamples,y1);
//    FramesOfData.set(fingerIndex.type,bone.type,5,currentSamples,z1);
    //expanding the canvas and apply new scaling 
    var canvasX = window.innerWidth * normalizedPrevJoint[0];
    var canvasY = window.innerHeight * (1 - normalizedPrevJoint[1]);
    var canvasX1 = window.innerWidth * normalizedNextJoint[0];
    var canvasY1 = window.innerHeight * (1 - normalizedNextJoint[1]);
    //sum of cords noramized 
    var Sum = (x + x1 + y + y1 + z + z1);
    //call line p5 method 
    thick;
    stroke;
    //create a hand variable and and draw only green if only one hand is detected 
    if (previousNumHands === 1){
         line(canvasX,canvasY,canvasX1,canvasY1);
    }
    else{
        stroke('red');
        line(canvasX,canvasY,canvasX1,canvasY1);
    }
}
function HandleHand(hand,interactionBox){
        var fingers = hand.fingers;
        for (var i = 0;i < fingers.length; i++){
            //console.log(fingers);
            var thick = strokeWeight(2);
             var finger = fingers[i];
             //console.log(finger);
             var bones = finger.bones;
             //console.log(bones);
            for (var x = 0; x <bones.length; x++){
                var bone = bones[x];
                //console.log(bone);
                if(bones[x].type === 0){
                    var thick = strokeWeight(10);
                    var bone = bones[x];
                    stroke('rgb(0,255,0)');
                    HandleBone(bone,thick,stroke,finger,interactionBox);
                }
                if(bones[x].type === 1){
                    var thick = strokeWeight(10);
                    var bone = bones[x];
                    stroke('rgb(0,255,0)');
                    HandleBone(bone,thick,stroke,finger,interactionBox);
                }
                if(bones[x].type === 2){
                    var thick = strokeWeight(5);
                    var bone = bones[x];
                    stroke(51);
                    HandleBone(bone,thick,stroke,finger,interactionBox);
                }
                HandleBone(bone,thick,stroke,finger,interactionBox);
                
         
            }
            
        }
    }
            
function Handleframe(frame){
        var interactionBox = frame.interactionBox;
	if(frame.hands.length===1 || frame.hands.length===2){    
                clear();
                currentNumHands = frame.hands.length;
                var hand = frame.hands[0];
                //console.log(hand);
		HandleHand(hand,interactionBox);
                RecordData();
                previousNumHands = currentNumHands;
	}
}

Leap.loop(controllerOptions, function(frame){
	
	Handleframe(frame);

});
