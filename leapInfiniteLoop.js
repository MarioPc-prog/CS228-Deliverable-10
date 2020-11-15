var controllerOptions = {};
var x = window.innerWidth;
var y = window.innerHeight;
var rawXMin = 1000;
var rawXMax = 100;
var rawYMin = 1000;
var rawYMax = 100;
function HandleFinger(finger){
	var x = finger.tipPosition[0];
	var y=finger.tipPosition[1];
	var z=finger.tipPosition[2];
	//makes y value go up and down 
	y=window.innerHeight-y;
	//checks wheather the current horizontal position of the tip is less than the value stored in rawXMin.
	if (finger.tipPosition[0] <rawXMin){
		rawXMin=finger.tipPosition[0];
	}
	if (finger.tipPosition[0] > rawXMax){
                rawXMax=finger.tipPosition[0];
        }
	if (finger.tipPosition[1] <rawYMin){
                rawYMin=finger.tipPosition[1];
        }
	if (finger.tipPosition[1] > rawYMax){
                rawYMax=finger.tipPosition[1];
        }
	var oldRangeX = (rawXMax-rawXMin);
	var newRangeX=(window.innerWidth-0);
	var x =(((x - rawXMin) * newRangeX) /oldRangeX) + rawXMin;

	var oldRangeY = (rawYMax-rawYMin);
        var newRangeY=(window.innnerHeight-y-0);
        var newY =(((y - rawYMin) * newRangeY) /oldRangeY) + rawYMin;
	newY =(y-rawYMin)*(window.innerHeight-0)/(rawYMax-rawYMin)+rawYMin
 	circle(x,y,50);
}
function HandleHand(hand){
	 var fingers=hand.fingers;
        for (var i=0;i<fingers.length;i++){
        //console.log(fingers[i]);
        	if(fingers[i].type==1){
                	var finger = fingers[i];
			HandleFinger(finger);
        	}
        }
                //console.log(finger);


}
function Handleframe(frame){
	if(frame.hands.length==1){
        	//console.log(frame.hands);
                var hand = frame.hands[0];
		HandleHand(hand);
	}
}
Leap.loop(controllerOptions, function(frame){
	clear();
	Handleframe(frame);

});
