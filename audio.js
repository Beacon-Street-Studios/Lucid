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
            sampleUrls[key] = `${voice.file}${i}.mp3`;
            midiNumber++; 
        }
    } else {
        for (var j = 0; j < voice.samples.length; j++) {
            let sample = voice.samples[j];

            for (var i = 1; i <= sample.count; i++) {
                let key = Tone.Frequency(midiNumber, "midi").toNote();
                sampleUrls[key] = `${sample.file}${i}.mp3`;
                noteTags[midiNumber] = sample.tag.split(',');
                midiNumber++; 
            }
        }
    }

    noteRanges[index] = range(midiStart, midiNumber - 1);
});

// Track loading progress
let totalSamples = Object.keys(sampleUrls).length;
let loadedSamples = 0;

// Create a function to update the loading progress bar
function updateLoadingProgress() {
    loadedSamples++;
    let progress = Math.min(Math.floor((loadedSamples / totalSamples) * 100), 100);
    let loadingBar = document.getElementById('audio-loader-bar');
    if (loadingBar) {
        loadingBar.style.width = progress + '%';
    }
    
    // Hide loader when complete
    if (progress >= 100) {
        setTimeout(function() {
            let loader = document.getElementById('audio-loader');
            if (loader) {
                // First fade out
                loader.classList.add('fade-out');
                
                // Then hide after transition completes
                setTimeout(function() {
                    loader.classList.add('hidden');
                }, 800);
            }
        }, 500);
    }
}

const sampler = new Tone.Sampler({
	urls: sampleUrls,
	release: 1,
	baseUrl: "./audio/",
    onload: function() {
        // All samples loaded
        let loader = document.getElementById('audio-loader');
        if (loader) {
            document.getElementById('audio-loader-bar').style.width = '100%';
            setTimeout(function() {
                // First fade out
                loader.classList.add('fade-out');
                
                // Then hide after transition completes
                setTimeout(function() {
                    loader.classList.add('hidden');
                }, 800);
            }, 500);
        }
    },
    onerror: function(error) {
        console.error("Error loading samples:", error);
        // Hide loader even on error after 8 seconds
        setTimeout(function() {
            let loader = document.getElementById('audio-loader');
            if (loader) {
                // First fade out
                loader.classList.add('fade-out');
                
                // Then hide after transition completes
                setTimeout(function() {
                    loader.classList.add('hidden');
                }, 800);
            }
        }, 8000);
    }
}).toDestination();

// Track individual buffer loads
Object.keys(sampleUrls).forEach(note => {
    // Create an observer to track the loading of each buffer
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "./audio/" + sampleUrls[note], true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = updateLoadingProgress;
    xhr.send();
});

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
    // Get min/max time bounds from the configuration
    let min = config.voices[voiceIndex].min ?? 0.0;
    let configMax = config.voices[voiceIndex].max ?? (config.duration * 0.9);
    
    // Calculate the right boundary to ensure sprites aren't cut off
    const canvasWidth = 1920;
    const menuWidth = 417;
    const sequenceWidth = canvasWidth - menuWidth - 16; // From main.js
    
    // Using a 300px margin as requested
    const rightMargin = 300;
    
    // Calculate what time value would put a sprite at the maximum allowable x position
    const maxAllowedX = canvasWidth - rightMargin;
    const maxAllowableTime = ((maxAllowedX - menuWidth - 8) / sequenceWidth) * config.duration;
    
    // If the configMax would place a sprite beyond our boundary, use the boundary-based max instead
    let max = configMax;
    
    // Only apply the boundary constraint if it would actually be more restrictive
    // This ensures we respect both the config limits and the boundary
    if (maxAllowableTime < configMax) {
        max = maxAllowableTime;
    }

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