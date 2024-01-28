// const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();
// Tone.loaded().then(() => {
// 	player.start();
// });

//const synth = new Tone.Synth().toDestination();

// let noteRanges = {
//     0 : ['C1', 'C#1'],
//     1 : ['C2', 'C#2'],
//     2 : ['C3', 'C#4'],
//     3 : ['C4', 'C#4'],
// }

const range = (start, stop, step=1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);


let sampleUrls = {};
let noteRanges = {};
let noteTags = {};

let midiNumber = 0;
let midiStart = midiNumber;

let part;
let playbackRate = config.defaultPlaybackRate;
let nextPlaybackRate = config.defaultPlaybackRate;

config.voices.forEach( (voice, index) => {
    midiStart = midiNumber;
    if (voice.samples == undefined) {
        for (var i = 1; i <= voice.count; i++) {
            let key = Tone.Frequency(midiNumber, "midi").toNote();
            sampleUrls[key] = `${voice.file}${i}.wav`;
            midiNumber++; 
        }
    } else {
        for (var j = 0; j < voice.samples.length; j++) {
            let sample = voice.samples[j];

            for (var i = 1; i <= sample.count; i++) {
                let key = Tone.Frequency(midiNumber, "midi").toNote();
                sampleUrls[key] = `${sample.file}${i}.wav`;
                noteTags[midiNumber] = sample.tag.split(',');
                midiNumber++; 
            }
        }
    }

    noteRanges[index] = range(midiStart, midiNumber - 1);
});

const sampler = new Tone.Sampler({
	urls: sampleUrls,
	release: 1,
	baseUrl: "./audio/",
}).toDestination();

function progress() {
    // return Tone.Transport.seconds / config.duration;
    return Tone.Transport.seconds / (config.duration / playbackRate) ;
}

function createPart(values) {
    if (typeof part !== "undefined") { 
        part.dispose()
    }
    part = new Tone.Part(((time, value) => {
        sampler.triggerAttackRelease(value.note, 4.0, time, value.velocity)
        value.noteImg.animate();
    }), values);
    
    part.playbackRate = playbackRate;
    part.start(0);
}

function playPart() {
    Tone.start();
    Tone.Transport.seconds = 0;
    Tone.Transport.start();
    let duration = config.duration / playbackRate;
    Tone.Transport.stop("+" + duration);
}

function stop() {
    Tone.Transport.seconds = 0;
    Tone.Transport.stop();
}

function randomNotes(length = config.voiceCount, filter = []) {
    // return Array.from([0,1,2,3], (i) => randomNote(i));
    return Array.from({length: length}, (_, i) => randomNote(i, filter));
  }
  
function randomNote(voiceIndex, filter=[]) {
    let min = config.voices[voiceIndex].min ?? 0.0;
    let max = config.voices[voiceIndex].max ?? (config.duration * 0.9);

    let time = min + Math.random() * (max - min);
    let velocity = Math.random() * 0.9 + 0.1;
    
    let noteIndex;
    let notes = filteredNotes(voiceIndex, filter);
    let index = Math.floor(Math.random() * notes.length);
    let noteValue = notes[index];
    noteIndex = noteRanges[voiceIndex].indexOf(noteValue);
    // noteIndex = notes[index];
    
    // noteIndex = Math.floor(Math.random() * noteRanges[voiceIndex].length);
        
    let note = new NoteValue(time, velocity, voiceIndex, noteIndex);
    return note;
}

function filteredNotes(voiceIndex, filter) {
    let possibleNotes = noteRanges[voiceIndex];
    if (filter.length == 0) {
        return possibleNotes;
    } else {
        let returnFilter = possibleNotes.filter( note => noteTags[note].some(tag => filter.includes(tag)));
        return returnFilter;
    }
}

function randomTimeinMeasures() {
    let sixteenths = Math.floor(Math.random() * partDuration);
    let inSixteenths = sixteenths;
    let measures = Math.floor(sixteenths / 16);
    sixteenths %= 16;
    let quarters = Math.floor(sixteenths / 4);
    sixteenths %= 4;
    let time = measures + ":" + quarters + ":" + sixteenths;

    return {time, inSixteenths}
}

function logNotes() {
    let urls = noteImgs.map(noteImg => noteRanges[noteImg.noteValue.voiceIndex][noteImg.noteValue.noteIndex]).map( note => sampleUrls[Tone.Frequency(note, "midi").toNote()] )
    console.log(urls);
}

class NoteValue {
    constructor(time, velocity, voiceIndex, noteIndex) {
        this.time = time;
        this.velocity = velocity;
        this.voiceIndex = voiceIndex;
        this.noteIndex = noteIndex;
        this.noteImg = undefined;
    }

    get note() {
        let midiNumber = parseInt(noteRanges[this.voiceIndex][this.noteIndex]);
        return Tone.Frequency(midiNumber, "midi").toNote()
    }

    nextNoteIndex() {
        this.noteIndex += 1;
        this.noteIndex %= noteRanges[this.voiceIndex].length;
        this.previewSound();
    }

    previousNoteIndex() {
        this.noteIndex += noteRanges[this.voiceIndex].length - 1;
        this.noteIndex %= noteRanges[this.voiceIndex].length;
        this.previewSound();
    }

    previewSound() {
        sampler.triggerAttackRelease(this.note, 4.0, undefined, this.velocity);
    }

}