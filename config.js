var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 2.0;

let swellSamples = [
    {file: 'VISION/SWELL/bss_lucid_swell_vision_', count:21, tag: 'vision'},
    {file: 'FUTURE/SWELL/bss_lucid_swell_future_', count:24, tag: 'future'},
    {file: 'OPTIMISM/SWELL/bss_lucid_swell_optimism_', count:23, tag: 'optimism'},
    {file: 'INNOVATION/SWELL/bss_lucid_swell_innovation_', count:27, tag: 'innovation'},
];

let chimeSamples = [
    {file: 'VISION/CHIME/bss_lucid_chime_vision_', count:21, tag: 'vision'},
    {file: 'FUTURE/CHIME/bss_lucid_chime_future_', count:25, tag: 'future'},
    {file: 'OPTIMISM/CHIME/bss_lucid_chime_optimism_', count:23, tag: 'optimism'},
    {file: 'INNOVATION/CHIME/bss_lucid_chime_innovation_', count:26, tag: 'innovation'},
];

let melodySamples = [
    {file: 'VISION/MELODY/bss_lucid_melody_vision_', count:7, tag: 'vision'},
    {file: 'FUTURE/MELODY/bss_lucid_melody_future_', count:9, tag: 'future'},
    {file: 'OPTIMISM/MELODY/bss_lucid_melody_optimism_', count:13, tag: 'optimism'},
    {file: 'INNOVATION/MELODY/bss_lucid_melody_innovation_', count:11, tag: 'innovation'},
];

let percussionSamples = [
    {file: 'VISION/PERCUSSION/bss_lucid_percussion_vision_', count:9, tag: 'vision'},
    {file: 'FUTURE/PERCUSSION/bss_lucid_percussion_future_', count:14, tag: 'future'},
    {file: 'OPTIMISM/PERCUSSION/bss_lucid_percussion_optimism_', count:9, tag: 'optimism'},
    {file: 'INNOVATION/PERCUSSION/bss_lucid_percussion_innovation_', count:16, tag: 'innovation'},
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
config.backgroundColor = 'white';
config.backgroundImage = 'background.png';
config.sliderColor = '#D93F27';
config.tapDelay = 150;
