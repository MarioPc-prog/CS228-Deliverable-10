var controllerOptions = {};
var trainingCompleted = false;
var previousNumHands = 0;
var currentNumHands = 0;
var numSamples = 2;
var numberPrediction = 0;
//var predictedClassLabels = nj.zeros(2);
var oneFrameOfData = nj.zeros([5, 4, 6]); //good
const knnClassifier = ml5.KNNClassifier();
var digitToShow = 1;
var numPredictions = 0; //good
var accuracy = 0 // good
var programState = 0; //good 
var timeSinceLastDigitChange = new Date(); //good




function Train() {
    for (var i = 0; i < train7.shape[3]; i++) {
        var features = train7Bongard.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),7);
        var features = train0.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),0);
        var features = train0Allison.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),0);
        features = train1.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),1);
        features = train2Sheboy.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),2);
        features = train3Bongard.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),3);
        features = train4Faucher.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),4);
        features = train5Fekert.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),5);
        features = train6Bongard.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),6);
        features = train8Potts.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),8);
        features = train9Bongard.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),9);

    }
}

function Test() {
    var currentFeatures = oneFrameOfData;
    currentFeatures = currentFeatures.reshape(1,120);
    knnClassifier.classify(currentFeatures.tolist(),GotResults);

}
function GotResults(err, result) {
     ++numPredictions;
    accuracy = (((numPredictions - 1) * accuracy) + (result.label == digitToShow)) / numPredictions;
    console.log(numPredictions, accuracy, parseInt(result.label));

}
function Handleframe(frame) {
    var interactionBox = frame.interactionBox;
    //console.log(oneFrameOfData);
    if (frame.hands.length === 1 || frame.hands.length === 2) {

        var hand = frame.hands[0];
        HandleHand(hand, interactionBox);
        previousNumHands = currentNumHands;
    }
}
function HandleBone(bone, thick, stroke, fingerIndex, interactionBox) {
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

    oneFrameOfData.set(fingerIndex.type, bone.type, 0, x);
    oneFrameOfData.set(fingerIndex.type, bone.type, 1, y);
    oneFrameOfData.set(fingerIndex.type, bone.type, 2, z);
    oneFrameOfData.set(fingerIndex.type, bone.type, 3, x1);
    oneFrameOfData.set(fingerIndex.type, bone.type, 4, y1);
    oneFrameOfData.set(fingerIndex.type, bone.type, 5, z1);
    //expanding the canvas and apply new scaling 
    var canvasX = (window.innerWidth * x) * 0.5;
    var canvasX1 = (window.innerWidth * x1) * 0.5;
    var canvasY = (window.innerHeight * (1 - y)) * 0.5;
    var canvasY1 = (window.innerHeight * (1 - y1)) * 0.5;

    var green = accuracy * 255;
    var red = (1 - accuracy) * 255
    thick;
    stroke;
    if (bone.type === 0) {
        stroke(red, green, 0);
        strokeWeight(20);
        line(canvasX, canvasY, canvasX1, canvasY1);
    }
     if (bone.type === 1) {
        //stroke('rbg(192,192,192)');
        strokeWeight(15);
        line(canvasX, canvasY, canvasX1, canvasY1);
    }
    if (bone.type === 2) {
        stroke(red, green, 0);
        strokeWeight(10);
        line(canvasX, canvasY, canvasX1, canvasY1);

    }
    if (bone.type === 3) {
        stroke(red, green, 0);
        strokeWeight(5);
        line(canvasX, canvasY, canvasX1, canvasY1);
    }
}
function HandleHand(hand, interactionBox) {
    var width = 3;
    var fingers = hand.fingers;
    for (var i = 0; i < fingers.length; i++) {
        //console.log(fingers);
        var thick = strokeWeight(2);
        var finger = fingers[i];
        //console.log(finger);
        var bones = finger.bones;
        //console.log(bones);
        for (var x = 0; x < bones.length; x++) {
            var bone = bones[x];
            //console.log(bone);
            if (bones[x].type === 0) {
                var thick = strokeWeight(6 * width);
                var bone = bones[x];
                stroke(210);
                HandleBone(bone, thick, stroke, finger, interactionBox);
            }
            if (bones[x].type === 1) {
                var thick = strokeWeight(4 * width);
                var bone = bones[x];
                stroke(150);
                HandleBone(bone, thick, stroke, finger, interactionBox);
            }
            if (bones[x].type === 2) {
                var thick = strokeWeight(2 * width);
                var bone = bones[x];
                stroke(50);
                HandleBone(bone, thick, stroke, finger, interactionBox);
            }
            strokeWeight(1 * width);
            HandleBone(bone, thick, stroke, finger, interactionBox);


        }

    }
}
function CenterXData() {
    var xValues = oneFrameOfData.slice([], [], [0, 6, 3]);
    var currentMean = xValues.mean();
    return currentMean;
}
function CenterYData() {
    var yValues = oneFrameOfData.slice([], [], [1, 6, 3]);
    var currentMean = yValues.mean();
    return currentMean;

}
function CenterZData() {
    var zValues = oneFrameOfData.slice([], [], [2, 6, 3]);
    var currentMean = zValues.mean();
    return currentMean;

}
function HandIsTooFarToTheLeft() {
    if (CenterXData() < 0.25) {
        image(arrowRight, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        return true;
    } else {
        return false;
    }

}
function HandIsTooFarToTheRight() {
    if (CenterXData() > 0.75) {
        image(arrowLeft, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        return true;
    } else {
        return false;
    }
}
function HandIsTooFarToHigh() {
    if (CenterYData() < 0.25) {
        image(arrowUp, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        return true;
    } else {
        return false;
    }
}
function HandIsTooFarToLow() {
    if (CenterYData() > 0.75) {
        image(arrowDown, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        return true;
    } else {
        return false;
    }
}
function HandIsTooClose() {
    if (CenterZData() < 0.25) {
        image(arrowTowards, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        return true;
    } else {
        return false;
    }
}
function HandIsTooFar() {
    if (CenterZData() > 0.75) {
        image(arrowAway, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        return true;
    } else {
        return false;
    }
}
function HandIsUncentered() {

    if (HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarToHigh() || HandIsTooFarToLow() || HandIsTooFar() || HandIsTooClose()) {
        return true;
    } else {
        return false;
    }
    return HandIsTooFarToTheLeft();
}
function DetermineState(frame) {
    if (frame.hands.length == 0) {
        programState = 0
    } else {
        Handleframe(frame)
        if (HandIsUncentered()) {
            programState = 1
        } else {
            programState = 2
        }
    }
}
function HandleState0(frame) {
    TrainKNNIfNotDoneYet();
    DrawImageToHelpUserPutTheirHandOverTheDevice();
}
function HandleState1(frame) {
    

}
function HandleState2(frame) {
    Handleframe(frame);
    DrawLowerRightPanel();
    DetermineWhetherToSwitchDigits();
    Test();
}
function DrawLowerRightPanel() {
    if (digitToShow == 1) {
        image(ASL1, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
    } else {
        image(ASL2, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
    }
}
function DetermineWhetherToSwitchDigits() {
    if (TimeToSwitchDigits()) {
        SwitchDigits();
    }
}
function SwitchDigits() {
    if (digitToShow === 1) {
        digitToShow = 2;
    } else {
        digitToShow = 1;
    }
    numPredictions = 0;
}
function TimeToSwitchDigits() {
    let currentTime = new Date();
    let timeInBetweenInMilliseconds = currentTime - timeSinceLastDigitChange;
    let timeInBetweenInSeconds = timeInBetweenInMilliseconds / 1000;
    if (timeInBetweenInSeconds >= 5) {
        timeSinceLastDigitChange = new Date();
        return true;
    } else {
        return false;
    }
}
function TrainKNNIfNotDoneYet() {
    if (trainingCompleted == false) {
        Train();
        trainingCompleted = true;
    }
}
function DrawImageToHelpUserPutTheirHandOverTheDevice() {
    image(img, 20, 20, window.innerWidth / 2.2, window.innerHeight / 2.2);
}
function SignIn() {
    username = document.getElementById('username').value;
    var list = document.getElementById('users');
    if (IsNewUser(username, list)) {
        //functions to create new user and create Sign in item 
        CreateNewUser(username, list);
        CreateSignInItem(username, list);
    } else {
        var ID = String(username) + "_signins";
        //Will return such an item.
        var listItem = document.getElementById(ID);
        listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
    }
    console.log(list.innerHTML);
    return false;

}
function IsNewUser(username, list) {
    var usernameFound = false;
    var users = list.children;
    for (var i = 0; i < users.length; i++) {
        if (username == users[i].innerHTML) {
            usernameFound = true;
        }
    }
    return usernameFound == false;
}
function CreateNewUser(username, list) {
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
}
function CreateSignInItem(username, list) {
    var item2 = document.createElement('li');
    item2.id = String(username) + "_signins";
    item2.innerHTML = 1;
    list.appendChild(item2);
}
Leap.loop(controllerOptions, function (frame) {
    clear();
    DetermineState(frame);
    if (programState == 0) {
        HandleState0(frame);
    } else if (programState == 1) {
        HandleState1(frame);
    } else {
        HandleState2(frame);
    }


});
