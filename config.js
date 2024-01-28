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

// seconds as min/max bounds, min default 0, max default config.duration
config.voices = [
    {image: 'swell.png', samples: swellSamples, max: 1.5},
    {image: 'chime.png', file: 'FUTURE/CHIME/bss_honeywell_chime_future_', count:25, min: 1.5, max: 3.0},
    {image: 'melody.png', file: 'FUTURE/MELODY/bss_honeywell_melody_future_', count:9, min: 3.0},
    {image: 'percussion.png', file: 'FUTURE/PERCUSSION/bss_honeywell_percussion_future_', count:14}
];

config.spritedata = {
    spritesheet: 'test_spritesheet_200x200_128frames.png',
    frames: [...Array(128).keys()].map(i => { return {position: {x:0, y: i*200, w: 200, h: 200}} }),
}

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
config.backgroundColor = 'white';
config.backgroundImage = 'background.png';
config.sliderColor = '#D93F27';
config.tapDelay = 150;
