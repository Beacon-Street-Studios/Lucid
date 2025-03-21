var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 2.0;

let swellSamples = [
    {file: 'HUMANITY/SWELL/bss_lucid_swell_humanity_', count:12, tag: 'humanity'},
    {file: 'DEFIANCE/SWELL/bss_lucid_swell_defiance_', count:10, tag: 'defiance'},
    {file: 'SOPHISTICATION/SWELL/bss_lucid_swell_sophistication_', count:11, tag: 'sophistication'},
    {file: 'INNOVATION/SWELL/bss_lucid_swell_innovation_', count:10, tag: 'innovation'},
];

let chimeSamples = [
    {file: 'HUMANITY/CHIME/bss_lucid_chime_humanity_', count:10, tag: 'humanity'},
    {file: 'DEFIANCE/CHIME/bss_lucid_chime_defiance_', count:11, tag: 'defiance'},
    {file: 'SOPHISTICATION/CHIME/bss_lucid_chime_sophistication_', count:12, tag: 'sophistication'},
    {file: 'INNOVATION/CHIME/bss_lucid_chime_innovation_', count:10, tag: 'innovation'},
];

let melodySamples = [
    {file: 'HUMANITY/MELODY/bss_lucid_melody_humanity_', count:15, tag: 'humanity'},
    {file: 'DEFIANCE/MELODY/bss_lucid_melody_defiance_', count:10, tag: 'defiance'},
    {file: 'SOPHISTICATION/MELODY/bss_lucid_melody_sophistication_', count:10, tag: 'sophistication'},
    {file: 'INNOVATION/MELODY/bss_lucid_melody_innovation_', count:10, tag: 'innovation'},
];

let percussionSamples = [
    {file: 'HUMANITY/PERCUSSION/bss_lucid_percussion_humanity_', count:10, tag: 'humanity'},
    {file: 'DEFIANCE/PERCUSSION/bss_lucid_percussion_defiance_', count:10, tag: 'defiance'},
    {file: 'SOPHISTICATION/PERCUSSION/bss_lucid_percussion_sophistication_', count:10, tag: 'sophistication'},
    {file: 'INNOVATION/PERCUSSION/bss_lucid_percussion_innovation_', count:10, tag: 'innovation'},
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

// seconds as min/max bounds, min default 0, max default config.duration
config.voices = [
    {sprite: swellSprite, samples: swellSamples, max: 1.5},
    {sprite: chimeSprite, samples: chimeSamples, min: 1.5, max: 2.7},
    {sprite: melodySprite,  samples: melodySamples, min: 2.7},
    {sprite: percussionSprite,  samples: percussionSamples}
];

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
config.backgroundColor = '#222222';
config.backgroundImage = 'background.png';
config.sliderColor = '#222222';
config.tapDelay = 150;
