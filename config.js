var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 2.0;

// Dynamic sample loading configuration
// Each object defines the pattern and tag, with count to be determined at runtime
let swellSamples = [
    {file: 'HUMANITY/SWELL/bss_lucid_swell_humanity_', tag: 'humanity', pattern: 'bss_lucid_swell_humanity_'},
    {file: 'DEFIANCE/SWELL/bss_lucid_swell_defiance_', tag: 'defiance', pattern: 'bss_lucid_swell_defiance_'},
    {file: 'SOPHISTICATION/SWELL/bss_lucid_swell_sophistication_', tag: 'sophistication', pattern: 'bss_lucid_swell_sophistication_'},
    {file: 'INNOVATION/SWELL/bss_lucid_swell_innovation_', tag: 'innovation', pattern: 'bss_lucid_swell_innovation_'},
];

let chimeSamples = [
    {file: 'HUMANITY/CHIME/bss_lucid_chime_humanity_', tag: 'humanity', pattern: 'bss_lucid_chime_humanity_'},
    {file: 'DEFIANCE/CHIME/bss_lucid_chime_defiance_', tag: 'defiance', pattern: 'bss_lucid_chime_defiance_'},
    {file: 'SOPHISTICATION/CHIME/bss_lucid_chime_sophistication_', tag: 'sophistication', pattern: 'bss_lucid_chime_sophistication_'},
    {file: 'INNOVATION/CHIME/bss_lucid_chime_innovation_', tag: 'innovation', pattern: 'bss_lucid_chime_innovation_'},
];

let melodySamples = [
    {file: 'HUMANITY/MELODY/bss_lucid_melody_humanity_', tag: 'humanity', pattern: 'bss_lucid_melody_humanity_'},
    {file: 'DEFIANCE/MELODY/bss_lucid_melody_defiance_', tag: 'defiance', pattern: 'bss_lucid_melody_defiance_'},
    {file: 'SOPHISTICATION/MELODY/bss_lucid_melody_sophistication_', tag: 'sophistication', pattern: 'bss_lucid_melody_sophistication_'},
    {file: 'INNOVATION/MELODY/bss_lucid_melody_innovation_', tag: 'innovation', pattern: 'bss_lucid_melody_innovation_'},
];

let percussionSamples = [
    {file: 'HUMANITY/PERCUSSION/bss_lucid_percussion_humanity_', tag: 'humanity', pattern: 'bss_lucid_percussion_humanity_'},
    {file: 'DEFIANCE/PERCUSSION/bss_lucid_percussion_defiance_', tag: 'defiance', pattern: 'bss_lucid_percussion_defiance_'},
    {file: 'SOPHISTICATION/PERCUSSION/bss_lucid_percussion_sophistication_', tag: 'sophistication', pattern: 'bss_lucid_percussion_sophistication_'},
    {file: 'INNOVATION/PERCUSSION/bss_lucid_percussion_innovation_', tag: 'innovation', pattern: 'bss_lucid_percussion_innovation_'},
];

let swellSprite = {
    spritesheet: 'swell_spritesheet_300x300.png',
    frames: [...Array(120).keys()].map(i => { return {position: {x:0, y: i*300, w: 300, h: 300}} }),
}

let chimeSprite = {
    spritesheet: 'chime_spritesheet_300x300.png',
    frames: [...Array(120).keys()].map(i => { return {position: {x:0, y: i*300, w: 300, h: 300}} }),
}

let melodySprite = {
    spritesheet: 'melody_spritesheet_300x300.png',
    frames: [...Array(120).keys()].map(i => { return {position: {x:0, y: i*300, w: 300, h: 300}} }),
}

let percussionSprite = {
    spritesheet: 'percussion_spritesheet_300x300.png',
    frames: [...Array(120).keys()].map(i => { return {position: {x:0, y: i*300, w: 300, h: 300}} }),
}

// Voice configuration for audio engine
// This structure allows for dynamic discovery of available audio files
config.voices = [
    {
        name: 'swell',
        sprite: swellSprite,
        samples: swellSamples,
        max: 1.5
    },
    {
        name: 'chime',
        sprite: chimeSprite,
        samples: chimeSamples,
        min: 1.5, max: 2.7
    },
    {
        name: 'melody',
        sprite: melodySprite,
        samples: melodySamples,
        min: 2.7
    },
    {
        name: 'percussion',
        sprite: percussionSprite,
        samples: percussionSamples
    }
];

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
config.backgroundColor = '#222222';
config.backgroundImage = 'background.png';
config.sliderColor = '#222222';
config.tapDelay = 150;
