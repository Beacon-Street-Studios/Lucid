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

// Helper function to add delay between fetch requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to check if a file exists with throttling to avoid rate limits
async function checkFileExists(url, maxRetries = 3, initialDelay = 200) {
    let retries = 0;
    let currentDelay = initialDelay;
    
    while (retries < maxRetries) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            retries++;
            if (retries >= maxRetries) {
                console.warn(`Failed to check ${url} after ${maxRetries} attempts`);
                return false;
            }
            // Exponential backoff
            await delay(currentDelay);
            currentDelay *= 2; // Double the delay for next retry
        }
    }
    return false;
}

// Function to dynamically find available audio files
async function discoverAudioFiles() {
    // Track the highest file number found for each sample pattern
    let maxFileNumbers = {};
    
    // Limit the maximum number of files to check to reduce server load
    const MAX_FILES_TO_CHECK = 30; // Reduced from 100
    
    // Iterate through all voice types and their samples
    for (const voice of config.voices) {
        if (!voice.samples) continue;
        
        for (const sample of voice.samples) {
            if (!sample.pattern) continue;
            
            maxFileNumbers[sample.pattern] = 0;
            if (!sample.fileFormats) sample.fileFormats = {};
            
            // Check files sequentially instead of all at once
            for (let i = 1; i <= MAX_FILES_TO_CHECK; i++) {
                // First check if WAV exists
                const wavUrl = `./audio/${sample.file}${i}.wav`;
                const wavExists = await checkFileExists(wavUrl);
                
                if (wavExists) {
                    maxFileNumbers[sample.pattern] = Math.max(maxFileNumbers[sample.pattern], i);
                    sample.fileFormats[i] = '.wav';
                    continue; // If WAV exists, don't bother checking MP3
                }
                
                // Only check for MP3 if WAV doesn't exist
                const mp3Url = `./audio/${sample.file}${i}.mp3`;
                const mp3Exists = await checkFileExists(mp3Url);
                
                if (mp3Exists) {
                    maxFileNumbers[sample.pattern] = Math.max(maxFileNumbers[sample.pattern], i);
                    sample.fileFormats[i] = '.mp3';
                } else if (i > 1 && !wavExists && !mp3Exists) {
                    // If we don't find either format and we're past the first file,
                    // assume we've reached the end of files for this pattern
                    break;
                }
                
                // Add a small delay between checks to be gentle on the server
                await delay(50);
            }
        }
    }
    
    // Now we need to update sample counts based on what we found
    config.voices.forEach(voice => {
        if (voice.samples) {
            voice.samples.forEach(sample => {
                if (sample.pattern && maxFileNumbers[sample.pattern] > 0) {
                    sample.count = maxFileNumbers[sample.pattern];
                    console.log(`Found ${sample.count} files for pattern: ${sample.pattern}`);
                }
            });
        }
    });
    
    // Now rebuild the audio mappings with the discovered counts
    initializeAudioMappings();
}

// Separate function to initialize audio mappings after file discovery
function initializeAudioMappings() {
    // Reset values before rebuilding
    sampleUrls = {};
    noteRanges = {};
    noteTags = {};
    midiNumber = 0;
    
    config.voices.forEach((voice, index) => {
        midiStart = midiNumber;
        if (voice.samples == undefined) {
            for (var i = 1; i <= voice.count; i++) {
                let key = Tone.Frequency(midiNumber, "midi").toNote();
                // Default to WAV for non-sample voices
                sampleUrls[key] = `${voice.file}${i}.wav`;
                midiNumber++; 
            }
        } else {
            for (var j = 0; j < voice.samples.length; j++) {
                let sample = voice.samples[j];
                
                // Skip if count is 0 (no files found)
                if (!sample.count || sample.count <= 0) continue;

                for (var i = 1; i <= sample.count; i++) {
                    let key = Tone.Frequency(midiNumber, "midi").toNote();
                    // Use the detected file format (MP3 or WAV) or default to WAV
                    let fileFormat = (sample.fileFormats && sample.fileFormats[i]) ? sample.fileFormats[i] : '.wav';
                    sampleUrls[key] = `${sample.file}${i}${fileFormat}`;
                    noteTags[midiNumber] = sample.tag.split(',');
                    midiNumber++; 
                }
            }
        }

        noteRanges[index] = range(midiStart, midiNumber - 1);
    });
    
    console.log(`Total audio files mapped: ${Object.keys(sampleUrls).length}`);
}

// Initialize with discovery
discoverAudioFiles().then(() => {
    console.log("Audio file discovery complete");
    // Initialize sampler after discovery is complete
    sampler = new Tone.Sampler({
        urls: sampleUrls,
        release: 1,
        baseUrl: "./audio/",
    }).toDestination();
}).catch(error => {
    console.error("Error during audio file discovery:", error);
    // Fallback to traditional initialization if discovery fails
    initializeAudioMappings();
    
    // Create sampler with fallback mappings
    sampler = new Tone.Sampler({
        urls: sampleUrls,
        release: 1,
        baseUrl: "./audio/",
    }).toDestination();
});

// Define sampler variable at the top level so it can be used throughout the code
let sampler;

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