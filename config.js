var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 2.0;

let swellSamples = [
    {file: 'VISION/SWELL/bss_honeywell_swell_vision_', count:21, tag: 'vision'},
    {file: 'FUTURE/SWELL/bss_honeywell_swell_future_', count:24, tag: 'future'},
    {file: 'OPTIMISM/SWELL/bss_honeywell_swell_optimism_', count:23, tag: 'optimism'},
    {file: 'INNOVATION/SWELL/bss_honeywell_swell_innovation_', count:27, tag: 'innovation'},
];

let chimeSamples = [
    {file: 'VISION/CHIME/bss_honeywell_chime_vision_', count:21, tag: 'vision'},
    {file: 'FUTURE/CHIME/bss_honeywell_chime_future_', count:25, tag: 'future'},
    {file: 'OPTIMISM/CHIME/bss_honeywell_chime_optimism_', count:23, tag: 'optimism'},
    {file: 'INNOVATION/CHIME/bss_honeywell_chime_innovation_', count:26, tag: 'innovation'},
];

let melodySamples = [
    {file: 'VISION/MELODY/bss_honeywell_melody_vision_', count:7, tag: 'vision'},
    {file: 'FUTURE/MELODY/bss_honeywell_melody_future_', count:9, tag: 'future'},
    {file: 'OPTIMISM/MELODY/bss_honeywell_melody_optimism_', count:13, tag: 'optimism'},
    {file: 'INNOVATION/MELODY/bss_honeywell_melody_innovation_', count:11, tag: 'innovation'},
];

let percussionSamples = [
    {file: 'VISION/PERCUSSION/bss_honeywell_percussion_vision_', count:9, tag: 'vision'},
    {file: 'FUTURE/PERCUSSION/bss_honeywell_percussion_future_', count:14, tag: 'future'},
    {file: 'OPTIMISM/PERCUSSION/bss_honeywell_percussion_optimism_', count:9, tag: 'optimism'},
    {file: 'INNOVATION/PERCUSSION/bss_honeywell_percussion_innovation_', count:16, tag: 'innovation'},
];

let swellSprite = {
    spritesheet: 'test_spritesheet_200x200_128frames.png',
    frames: [...Array(128).keys()].map(i => { return {position: {x:0, y: i*200, w: 200, h: 200}} }),
}

let chimeSprite = {
    spritesheet: 'test_spritesheet_200x200_128frames.png',
    frames: [...Array(128).keys()].map(i => { return {position: {x:0, y: i*200, w: 200, h: 200}} }),
}

let melodySprite = {
    spritesheet: 'test_spritesheet_200x200_128frames.png',
    frames: [...Array(128).keys()].map(i => { return {position: {x:0, y: i*200, w: 200, h: 200}} }),
}

let percussionSprite = {
    spritesheet: 'test_spritesheet_200x200_128frames.png',
    frames: [...Array(128).keys()].map(i => { return {position: {x:0, y: i*200, w: 200, h: 200}} }),
}

// seconds as min/max bounds, min default 0, max default config.duration
config.voices = [
    {sprite: swellSprite, samples: swellSamples, max: 1.5},
    {sprite: chimeSprite, samples: chimeSamples, min: 1.5, max: 3.0},
    {sprite: melodySprite,  samples: melodySamples, min: 3.0},
    {sprite: percussionSprite,  samples: percussionSamples}
];

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
config.backgroundColor = 'white';
config.backgroundImage = 'background.png';
config.sliderColor = '#D93F27';
config.tapDelay = 150;
