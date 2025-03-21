let draggingIx;
let draggingOffset;
let noteImgs = [];
let playButton;
let randomButton;
let helpButton;
let saveButton;

let backgroundImg;

let slider;

let lastEvent;
let tapNote;

let activeFilter;
let filterButtons;

let spritesheetRefs = [];
let sprites = [];

// Loading screen variables
let totalAssets = 0;
let loadedAssets = 0;
let loadingScreenActive = true;

function countAudioFiles() {
  let count = 0;
  // Count audio files from the config
  config.voices.forEach(voice => {
    if (voice.samples) {
      voice.samples.forEach(sample => {
        count += sample.count;
      });
    } else if (voice.file && voice.count) {
      count += voice.count;
    }
  });
  return count;
}

function preload() {
  // Calculate total assets to load
  // Images to load: background + spritesheets + UI elements + audio files
  const visualAssets = 1 + config.voices.length + 13; // Background + spritesheets + UI elements
  const audioAssets = countAudioFiles();
  totalAssets = visualAssets + audioAssets;
  
  console.log(`Total assets to load: ${totalAssets} (${visualAssets} visual + ${audioAssets} audio)`);
  
  setupLoadingScreen();
  
  // Add loading handlers to each loadImage call
  if (typeof config.backgroundImage !== "undefined") { 
    backgroundImg = loadImage('img/' + config.backgroundImage, assetLoaded, loadError);
  } else {
    loadedAssets++; // Count as loaded even if not present
  }

  // imgRefs = config.voices.map( (voice) => { return loadImage('img/' + voice.image) } );
  spritesheetRefs = config.voices.map((voice) => { 
    return loadImage('img/' + voice.sprite.spritesheet, assetLoaded, loadError);
  });

  prevImg = loadImage('img/previous_sound.png', assetLoaded, loadError);
  nextImg = loadImage('img/next_sound.png', assetLoaded, loadError);

  playImg = loadImage('img/play.png', assetLoaded, loadError);
  stopImg = loadImage('img/stop.png', assetLoaded, loadError);
  randomImg = loadImage('img/random.png', assetLoaded, loadError);
  helpImg = loadImage('img/help.png', assetLoaded, loadError);
  saveImg = loadImage('img/save.png', assetLoaded, loadError);

  humanityImg = loadImage('img/HUMANITY.png', assetLoaded, loadError);
  defianceImg = loadImage('img/DEFIANCE.png', assetLoaded, loadError);
  sophisticationImg = loadImage('img/SOPHISTICATION.png', assetLoaded, loadError);
  innovationImg = loadImage('img/INNOVATION.png', assetLoaded, loadError);

  fasterImg = loadImage('img/faster.png', assetLoaded, loadError);
  slowerImg = loadImage('img/slower.png', assetLoaded, loadError);

  indicatorImg = loadImage('img/play_bar_indicator.png', assetLoaded, loadError);
  
  // Set a failsafe to ensure the loading screen eventually disappears
  // even if not all assets load properly
  setTimeout(function() {
    const loadingBar = document.getElementById('lucid-loader-bar');
    if (loadingBar && parseFloat(loadingBar.style.width) < 100) {
      console.log('Loading taking too long - forcing completion');
      loadingBar.style.width = '100%';
      setTimeout(hideLoadingScreen, 500);
    }
  }, 10000); // 10 second maximum wait time
}

function setupLoadingScreen() {
  // Reset the loading bar to 0%
  document.getElementById('lucid-loader-bar').style.width = '0%';
}

function assetLoaded() {
  loadedAssets++;
  updateProgress();
}

function updateProgress() {
  let progress = Math.min(Math.floor((loadedAssets / totalAssets) * 100), 100);
  document.getElementById('lucid-loader-bar').style.width = progress + '%';
  
  // Once loading is complete, hide the loading screen
  if (progress >= 100) {
    setTimeout(hideLoadingScreen, 500); // Slight delay to show completed bar
  }
}

function loadError(err) {
  console.error('Error loading asset:', err);
  assetLoaded(); // Count it as loaded to avoid stalling
}

function updateLoadingText(text) {
  document.getElementById('loading-text').innerText = text;
}

function hideLoadingScreen() {
  if (!loadingScreenActive) return;
  
  // Hide the loading screen
  const loadingScreen = document.getElementById('lucid-loader');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    // We'll leave it in the DOM but hidden with display: none !important
    loadingScreenActive = false;
  }
}

function setup() {
    createCanvas(1920, 1080);
    
    menuWidth = 417;
    sequenceWidth = 1920 - menuWidth - 16;

    sequenceHeight = 869 - 229 - 16;

    partDuration = 2 * 4 * 4;

    url = new URL(window.location.href);
    shouldLoadURL = url.searchParams.has('v0')

    let notes;
    if (shouldLoadURL) {
      playbackRate = decodePlaybackRate() ?? config.defaultPlaybackRate;
      nextPlaybackRate = playbackRate;
      notes = decodeURL();
    } else {
      notes = randomNotes();
    }

    sprites = config.voices.map( voice => voice.sprite ).map( (sprite, index) => loadSprite(sprite.frames, spritesheetRefs[index]) );

    createNoteImgs(notes);
    createPart(notes);

    randomButton = new Button(randomImg, 842, 831);
    playButton = new Button(playImg, 984, 816, stopImg);
    saveButton = new Button(saveImg, 1156, 831);

    // Set a consistent right edge position for all category buttons
    // Moved a total of 155 pixels to the right (85 + 60 + 10) as requested
    const rightEdgePosition = 365; // 210 + 85 + 60 + 10
    
    // Create buttons with right-alignment enabled
    // Y positions moved down by 3 pixels
    humanityButton = new Button(humanityImg, rightEdgePosition, 775, undefined, 'humanity', true);
    defianceButton = new Button(defianceImg, rightEdgePosition, 842, undefined, 'defiance', true);
    sophisticationButton = new Button(sophisticationImg, rightEdgePosition, 909, undefined, 'sophistication', true);
    innovationButton = new Button(innovationImg, rightEdgePosition, 976, undefined, 'innovation', true);
    filterButtons = [humanityButton, defianceButton, sophisticationButton, innovationButton];
    updateActiveFilter();

    slider = new HScrollbar(910, 1030-8, 294, 16, 16, 0.1, 4.0, playbackRate);

    helpButton = new Button(helpImg, 1831, 992);
}

function loadSprite(frames, spritesheet) {
  let animation = [];
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  return new Sprite(animation, 1);
}

function createNoteImgs(notes) {
  noteImgs = []
  notes.forEach(function (note) {
    let left = sequenceWidth * note.time / config.duration + menuWidth + 8;
    let top = (1 - note.velocity) * sequenceHeight + 8;
    
    // Get sprite for this note
    let sprite = sprites[note.voiceIndex];
    
    // Create note with initial position
    let newNote = new Note(undefined, left, top, note, sprite);
    
    note.noteImg = newNote;
    noteImgs.push(newNote);
  });
}

function draw() {
  // Use dark background color first, then overlay background image if available
  background('#222222');
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height);
  }

  let menuColor = color('#FFFFFF');
  menuColor.setAlpha(76);
  fill(menuColor);

  noStroke();

  humanityButton.display();
  defianceButton.display();
  sophisticationButton.display();
  innovationButton.display();

  playButton.selected = Tone.Transport.seconds > 0.001;
  playButton.display();

  randomButton.display();
  helpButton.display();
  saveButton.display();

  image(slowerImg, 821, 966);
  image(fasterImg, 1207, 971);

  noteImgs.forEach( (note) => { note.display(); })

  let progressX = sequenceWidth * progress() - indicatorImg.width / 2;
  image(indicatorImg, menuWidth + 8 + progressX, 0);

  slider.update();
  slider.display();
}



function mousePressed() {
  lastEvent = millis();
  if ( playButton.inBounds(mouseX, mouseY) ) {
    updatePart();
    play();
    return;
  }

  if ( randomButton.inBounds(mouseX, mouseY) ) {
    let notes = randomNotes(undefined, activeFilter);
    createPart(notes);
    createNoteImgs(notes);
    forcePlay();
    logNotes();
    return;
  }

  if ( helpButton.inBounds(mouseX, mouseY) ) {
    modalTinyNoFooter.setContent('<img id="help" src="img/help_modal.png">');
    modalTinyNoFooter.open();
    return;
  }

  if ( saveButton.inBounds(mouseX, mouseY) ) {
    let url = encodeURL();
    document.getElementById('link').innerHTML = url;
    modalTinyNoFooter.setContent(document.querySelector('.modal-content').innerHTML);
    // modalTinyNoFooter.setContent(`<h2>Copy this link to share your creation:</h2><p>${url}</p>`);
    modalTinyNoFooter.open();
    return;
  }

  filterButtons.forEach( (filterButton, i) => {
    if ( filterButton.inBounds(mouseX, mouseY) ) {
      filterButton.toggle();
      updateActiveFilter();
    }
  });
  let filter = []

  for (let i = noteImgs.length - 1; i >= 0; i--) {
    if ( noteImgs[i].inPreviousHover(mouseX, mouseY) ) {
      noteImgs[i].noteValue.previousNoteIndex();
      break;
    }
    if ( noteImgs[i].inNextHover(mouseX, mouseY) ) {
      noteImgs[i].noteValue.nextNoteIndex();
      break;
    }
    if ( noteImgs[i].inBounds(mouseX, mouseY) ) {
      tapNote = noteImgs[i].noteValue;
      let relativePos = createVector(mouseX - noteImgs[i].x, mouseY - noteImgs[i].y);
      draggingIx = i;
      draggingOffset = relativePos;
      break;
    }
  }
}

function updateActiveFilter() {
  activeFilter = filterButtons.reduce(function(filters, button) {
    if (button.enabled) {
       filters.push(button.tag);
    }
    return filters;
  }, []);
}

function updatePart() {
  let notes = noteImgs.map((note) => note.noteValue ) 
  createPart(notes);
}

function play() {
  if (playButton.selected) {
    stop();
    return;
  }

  forcePlay();
}

function forcePlay() {
  playbackRate = nextPlaybackRate;
  playPart();
}

function mouseMoved() {

  if (draggingIx >= 0) {
    noteImgs.forEach((noteImg, index) => noteImg.hover = false);
    return;
  }

  let hoverIndex = -1;
  for (let i = noteImgs.length - 1; i >= 0; i--) {
    if ( noteImgs[i].inBounds(mouseX, mouseY) ) {
      hoverIndex = i;
      break;
    }
  }
  noteImgs.forEach((element, index, arr) => arr[index].hover = index == hoverIndex);
}

function mouseReleased() {
  let elapsed = millis() - lastEvent;
  if (elapsed < config.tapDelay) {
    tapNote?.previewSound();
  }
  tapNote = undefined;
  updatePart();
  nextPlaybackRate = slider.getValue();
  draggingIx = draggingOffset = undefined;
}

function mouseDragged() {
  if (draggingIx >= 0) {
    noteImgs[draggingIx].x = mouseX - draggingOffset.x;
    noteImgs[draggingIx].y = mouseY - draggingOffset.y;
    noteImgs[draggingIx].updateValue();
  }
}

class Note {
  constructor(img, x, y, noteValue, sprite) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.sprite = sprite;
    this.noteValue = noteValue;
    this.hover = false;
  }

  display() {
    if (this.sprite == undefined) {
      image(this.img, this.x, this.y);
    } else {
      if (this.sprite.index > 0) {
        this.sprite.animate();
      }
      this.sprite.show(this.x, this.y);
    }
    if (this.hover) {
      image(prevImg, this.x, this.y + this.height() - prevImg.height);
      image(nextImg, this.x + this.width() - prevImg.width, this.y + this.height() - prevImg.height);
      //displayTextNote.bind(this)()
    }
  }

  displayTextNote() {
    fill('white');
    textSize(32);
    let noteIndex = 'Chunk!';
    let width = textWidth(noteIndex);
    let height = 32;
    text(noteIndex, this.x, this.y + this.height());
  }

  animate() {
    if (this.sprite !== undefined) {
      this.sprite.index = 1;
    } else {
      this.bounce()    
    }
  }

  bounce() {
    let bounceTween = p5.tween.manager.addTween(this)
      .addMotion('y', this.y + 20, 50, 'easeInQuad')
      .addMotion('y', this.y - 10, 50, 'easeInQuad')
      .addMotion('y', this.y, 50, 'easeOutQuad');
    bounceTween.startTween();
  }

  updateValue() {
    // let left = sequenceWidth * note.time / totalDuration + menuWidth + 8;
    this.noteValue.time = ( this.x - (menuWidth + 8) ) / sequenceWidth * config.duration;
    // let top = (1 - note.velocity) * sequenceHeight + 8;
    this.noteValue.velocity = (1 - (this.y - 8) / sequenceHeight);
  }

  maxX() {
    return this.x + this.width();
  }

  maxY() {
    return this.y + this.height();
  }

  width() {
    if (this.sprite == undefined) {
      return this.img.width;
    } else {
      return this.sprite.width();
    }
  }

  height() {
    if (this.sprite == undefined) {
      return this.img.height;
    } else {
      return this.sprite.height();
    }
  }

  inPreviousHover(x, y) {
    return ( 
      between(x, this.x, this.x + prevImg.width) && 
      between(y, this.y + this.height() - prevImg.height, this.y + this.height()) 
    );
  }

  inNextHover(x, y) {
    return ( 
      between(x, this.x + this.width() - nextImg.width, this.x + this.width() ) && 
      between(y, this.y + this.height() - prevImg.height, this.y + this.height() ) 
    );
  }

  inBounds(x, y) {
    return ( between(x, this.x, this.maxX()) && between(y, this.y, this.maxY()) );
  }
}

class Button {
  constructor(img, x, y, selectedImg, tag, rightAligned = false) {
    this.rightAligned = rightAligned;
    
    if (rightAligned) {
      // For right-aligned buttons, x represents the right edge position
      this.rightEdge = x;
      this.x = x - img.width;
    } else {
      this.x = x;
    }
    
    this.y = y;
    this.img = img;
    this.selectedImg = selectedImg ?? img;
    this.selected = false;
    this.enabled = true;
    this.tag = tag;
  }

  maxX() {
    return this.x + this.img.width;
  }

  maxY() {
    return this.y + this.img.height;
  }

  inBounds(x, y) {
    return ( between(x, this.x, this.maxX()) && between(y, this.y, this.maxY()) );
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  display() {
    if ( this.enabled == true ){
      noTint();
    } else {
      tint(255, 128);
    }

    let stateImage = this.selected ? this.selectedImg : this.img;
    
    if (this.rightAligned) {
      // Recalculate x position based on current image width
      this.x = this.rightEdge - stateImage.width;
    }
    
    image(stateImage, this.x, this.y);
  }
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function decodePlaybackRate() {
  urlParams = new URLSearchParams(window.location.search);
  let newRate = parseFloat(urlParams.get("r"));
  return isNaN(newRate) ? null : newRate;
}

function decodeURL() {
  urlParams = new URLSearchParams(window.location.search);
  let notes = [];
  for (var i = 0; i < config.voiceCount; i++) {
    let v = parseInt(urlParams.get("v" + i))
    let n = parseInt(urlParams.get("n" + i))
    let a = parseFloat(urlParams.get("a" + i))
    let t = parseFloat(urlParams.get("t" + i))
    
    let note = new NoteValue(t, a, v, n)
    notes.push(note);
  }

  return notes;
}

function encodeURL() {
  let params = {r: nextPlaybackRate};
  noteImgs.forEach( (noteImg, index) => {
    let noteValue = noteImg.noteValue;
    params['v' + index] = noteValue.voiceIndex;
    params['n' + index] = noteValue.noteIndex;
    params['a' + index] = noteValue.velocity.toFixed(2);;
    params['t' + index] = noteValue.time.toFixed(2);;
  });
  const searchParrams = new URLSearchParams(params);
  const new_url = new URL(`${document.location.origin}${document.location.pathname}?${searchParrams.toString()}`)
  return new_url;
}

//https://stackoverflow.com/questions/57279316/the-createslider-function-creates-the-slider-outside-of-the-canvas-how-to-pos
class HScrollbar {
  constructor(x, y, w, h, r, min, max, value) {
    this.width = w;
    this.height = h;
    this.radius = r;

    this.valueMin = min;
    this.valueMax = max;
    this.value = value;

    this.x = x;
    this.y = y - this.height / 2;

    this.posMin = this.x + this.radius;
    this.posMax = this.x + this.width - this.radius;
    this.pos = this.posMin + (this.posMax - this.posMin) * map(this.value, this.valueMin, this.valueMax, 0, 1);
    
    this.over = false;
    this.locked = false;
  }

  update() {
    if (this.overEvent()) {
      this.over = true;
    } else {
      this.over = false;
    }
    if (mouseIsPressed && this.over) {
      this.locked = true;
    }
    if (!mouseIsPressed) {
      this.locked = false;
    }
    if (this.locked) {
      this.pos = constrain(mouseX, this.posMin, this.posMax);
    }
  }

  overEvent() {
    if (mouseX > this.x && mouseX < this.x+this.width &&
       mouseY > this.y && mouseY < this.y+this.height) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    noStroke();

    let f = color(config.sliderColor);
    fill(f);
    let dW = this.pos - this.x;
    rect(this.x, this.y - this.height/2, dW, this.height, this.radius / 2);

    let b = color('black');
    b.setAlpha(76);
    fill(b);
    rect(this.pos, this.y - this.height/2, this.width - dW, this.height, this.radius / 2);

    fill(f);
    circle(this.pos, this.y, this.radius * 2);
  }

  getValue() {
    let relative = (this.pos - this.posMin) / (this.posMax - this.posMin);
    return map(relative, 0, 1, this.valueMin, this.valueMax);
  }
}

class Sprite {
  constructor(animation, speed) {
    this.animation = animation;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
  }

  height() {
    return this.animation[this.index].height;
  }

  width() {
    return this.animation[this.index].width;
  }

  show(x, y) {
    image(this.animation[this.index], x, y);
  }

  animate() {
    this.index += this.speed;
    this.index %= this.len;
  }
}