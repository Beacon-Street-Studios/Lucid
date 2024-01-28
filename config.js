var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 2.0;

let toasterSamples = [
    {file: 'bss_eggo_dingthing_toaster_1.wav', tag: 'vision,future'},
    {file: 'bss_eggo_dingthing_toaster_2.wav', tag: 'vision,future'},
    {file: 'bss_eggo_dingthing_toaster_3.wav', tag: 'vision,future'},
    {file: 'bss_eggo_dingthing_toaster_4.wav', tag: 'vision,future'},
    {file: 'bss_eggo_dingthing_toaster_5.wav', tag: 'innovation'},
    {file: 'bss_eggo_dingthing_toaster_6.wav', tag: 'innovation'},
    {file: 'bss_eggo_dingthing_toaster_7.wav', tag: 'optimism'},
    {file: 'bss_eggo_dingthing_toaster_8.wav', tag: 'optimism'},
    {file: 'bss_eggo_dingthing_toaster_9.wav', tag: 'innovation'},
    {file: 'bss_eggo_dingthing_toaster_10.wav', tag: 'optimism'},
    {file: 'bss_eggo_dingthing_toaster_11.wav', tag: 'optimism'},
];

// seconds as min/max bounds, min default 0, max default config.duration
config.voices = [
    {image: 'toaster.png', samples: toasterSamples, max: 1.5},
    {image: 'ding.png', file: 'bss_eggo_dingthing_ding_', count:17, min: 1.5, max: 3.0},  
    {image: 'waffle.png', file: 'bss_eggo_dingthing_waffle_', count:6, min: 3.0}, 
    {image: 'leggo.png', file: 'bss_eggo_dingthing_leggo_', count:11}
];

config.spritedata = {
    spritesheet: 'test_spritesheet_200x200_128frames.png',
    frames: [...Array(128).keys()].map(i => { return {position: {x:0, y: i*200, w: 200, h: 200}} }),
}

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
config.backgroundColor = '#FFD126';
// config.backgroundImage = 'lukas-blazek-EWDvHNNfUmQ-unsplash.jpg';
config.sliderColor = '#1C274C';
config.tapDelay = 150;
