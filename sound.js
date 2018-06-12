////notes frequency and duration
//    notes = [
//        [659, 4],
//        [659, 4],
//        [659, 4],
//        [523, 8],
//        [0, 16],
//        [783, 16],
//        [659, 4],
//        [523, 8],
//        [0, 16],
//        [783, 16],
//        [659, 4],
//        [0, 4],
//        [987, 4],
//        [987, 4],
//        [987, 4],
//        [1046, 8],
//        [0, 16],
//        [783, 16],
//        [622, 4],
//        [523, 8],
//        [0, 16],
//        [783, 16],
//        [659, 4],
//        [0, 32],
//        [659, 4],
//        [659, 4],
//        [659, 4],
//        [523, 8],
//        [0, 16],
//        [783, 16],
//        [659, 4],
//        [523, 8],
//        [0, 16],
//        [783, 16],
//        [659, 4],
//        [0, 4],
//        [987, 4],
//        [987, 4],
//        [987, 4],
//        [1046, 8],
//        [0, 16],
//        [783, 16],
//        [622, 4],
//        [523, 8],
//        [0, 16],
//        [783, 16],
//        [659, 4]
//    ];
//    
//    //reverse table
//    notes.reverse();
//    
//    //speed


var input = new synaptic.Layer(2); // Two inputs
var output = new synaptic.Layer(2); // Three outputs

input.project(output);

var trainingData = [
    {input: [0, 0], output: [0, 0]}, // Clap -> Sit
    {input: [1, 0], output: [1, 0]}, // Clap -> Sit
    {input: [0, 1], output: [0, 0.16]}, // Whistle -> Run
    {input: [1, 1], output: [1, 0.16]}, // Clap+Whistle -> Jump
];

var learningRate = 0.4;
 
function train() {
    for(var i = 0; i < trainingData.length; i++) {
        input.activate(trainingData[i]["input"]);
        output.activate();
        output.propagate(learningRate, trainingData[i]["output"]);
    }
}

function retrain() {
    for(var i = 0; i < 1000; i++) {
        trainingData = _.shuffle(trainingData);
        train();
    }
}
 
retrain(); // Start the training


var note=new Array(100);
for (i=0; i <100; i++){
	note[i]=new Array(2);
}

for(var k=0;k<100;k++){
        input.activate([Math.exp(Math.random()/Math.random()),Math.exp(Math.random()/Math.random())]); // Whistle
        var result = output.activate();
        //console.log(result[0]);
        //console.log(result[1]);
        note[k][0]=result[0]*1000;
        note[k][1]=result[1]*100;
         
}
console.log(note);

tempo = 10;
    
    //canvas
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    // create web audio api context
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var i = 0;
   var j = note.length - 1;

    
    //play melody
    function playMelody() {
       if (note.length > 0) {
                ctx.fillStyle = "black";
                ctx.fill();
        
            
            //notes rectangles
            ctx.stroke();
            ctx.fillRect(i, c.height / 2, note[j][1] * 2, (-note[j][0] / 3) / 2);
            ctx.fillRect(i, c.height / 2, note[j][1] * 2, (note[j][0] / 3) / 2);
            ctx.moveTo(0,c.height/2);
            ctx.lineTo(c.width,c.height/2);
            ctx.stroke();

            //playing
           i += note[j][1] * 2;
            notes = note.pop();
            playNote(notes[0],  100*256 / (notes[1] * tempo));
            retrain();
            
       }
        j--;
    }
    //console.log(notes);

    
    function playNote(frequency, duration) {
        // create Oscillator node
        var oscillator = audioCtx.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        

        setTimeout(
            function() {
                oscillator.stop();
                playMelody();
            }, duration);
    }