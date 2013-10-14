(function () {

  var AUDIO_FILE = 'sounds/clarity'
    , fft = document.getElementById( 'dancer' )
    , glow = document.getElementById( 'dancer2' )
    , particles = document.getElementById( 'dancer3' )
    , particlesGlow = document.getElementById( 'dancer4' )
    , ctx = fft.getContext( '2d' )
    , dancer
    , kick
    , startOnLoad = false

  /*
   * Dancer.js magic
   */

  function DateFormat(formatString,date){

      if (typeof date=='undefined'){
      var DateToFormat=new Date();
      }
      else{
          var DateToFormat=date;
      }
      var DAY         = DateToFormat.getDate();
      var DAYidx      = DateToFormat.getDay();
      var MONTH       = DateToFormat.getMonth()+1;
      var MONTHidx    = DateToFormat.getMonth();
      var YEAR        = DateToFormat.getYear();
      var FULL_YEAR   = DateToFormat.getFullYear();
      var HOUR        = DateToFormat.getHours();
      var MINUTES     = DateToFormat.getMinutes();
      var SECONDS     = DateToFormat.getSeconds();

      var arrMonths = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
      var arrDay=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
      var strMONTH;
      var strDAY;
      var strHOUR;
      var strMINUTES;
      var strSECONDS;
      var Separator;

      if(parseInt(MONTH)< 10 && MONTH.toString().length < 2)
          strMONTH = "0" + MONTH;
      else
          strMONTH=MONTH;
      if(parseInt(DAY)< 10 && DAY.toString().length < 2)
          strDAY = "0" + DAY;
      else
          strDAY=DAY;
      if(parseInt(HOUR)< 10 && HOUR.toString().length < 2)
          strHOUR = "0" + HOUR;
      else
          strHOUR=HOUR;
      if(parseInt(MINUTES)< 10 && MINUTES.toString().length < 2)
          strMINUTES = "0" + MINUTES;
      else
          strMINUTES=MINUTES;
      if(parseInt(SECONDS)< 10 && SECONDS.toString().length < 2)
          strSECONDS = "0" + SECONDS;
      else
          strSECONDS=SECONDS;

      switch (formatString){
          case "hh:mm:ss":
              return strHOUR + ':' + strMINUTES + ':' + strSECONDS;
          break;
          //More cases to meet your requirements.
      }
  }

  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      this.beginPath();
      if (r < 1) {
          this.rect(x, y, w, h);
      } else {
          if (window["opera"]) {
              this.moveTo(x+r, y);
              this.arcTo(x+r, y, x, y+r, r);
              this.lineTo(x, y+h-r);
              this.arcTo(x, y+h-r, x+r, y+h, r);
              this.lineTo(x+w-r, y+h);
              this.arcTo(x+w-r, y+h, x+w, y+h-r, r);
              this.lineTo(x+w, y+r);
              this.arcTo(x+w, y+r, x+w-r, y, r);
          } else {
              this.moveTo(x+r, y);
              this.arcTo(x+w, y, x+w, y+h, r);
              this.arcTo(x+w, y+h, x, y+h, r);
              this.arcTo(x, y+h, x, y, r);
              this.arcTo(x, y, x+w, y, r);
          }
      }
      this.closePath();
  };
  /** @expose */
  CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, r) {
      this.roundRect(x, y, w, h, r);
      this.fill();
  };
  /** @expose */
  CanvasRenderingContext2D.prototype.strokeRoundRect = function(x, y, w, h, r) {
      this.roundRect(x, y, w, h, r);
      this.stroke();
  }

  Dancer.addPlugin( 'fft', function( canvasEl, options ) {
    options = options || {};
    var
      ctx     = canvasEl.getContext( '2d' ),
      h       = canvasEl.height * 1,
      w       = canvasEl.width,
      width   = options.width || 5,
      spacing = 0,
      count   = 1094;

    ctx.fillStyle = options.fillStyle || "white";
    ctx.strokeStyle = "#FFF"

    this.bind( 'update', function() {
      var spectrum = this.getSpectrum();
      ctx.clearRect( 0, 0, w, h );
      for ( var i = 0, l = spectrum.length; i < l && i < count; i++ ) {
        ctx.fillRoundRect( i * width, h, width, -spectrum[ i ] * h * 4, 3)
      }
    });

    return this;
  });

  dancer = new Dancer();
  glowDancer = new Dancer();
  particleDancer = new Dancer();

  fft.style.webkitFilter = "blur(1px)"
  dancer.fft( fft, { fillStyle: '#FFF' }).load({ src: AUDIO_FILE, codecs: [ 'mp3' ]});

  glow.style.webkitFilter = "blur(7px)"
  glowDancer.fft( glow, { fillStyle: '#FFF' }).load({ src: AUDIO_FILE, codecs: [ 'mp3' ]});

  particlesGlow.style.webkitFilter = "blur(2px)"

  Dancer.isSupported() || loaded();
  !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();


  function feedParticles(particles, particlesGlow) {
    var ctx = particles.getContext( '2d' )
      , ctxGlow = particlesGlow.getContext('2d')
      , particlesContainer = []

    function Particle(x, y, r, o, s) {
      this.x = x
      this.y = y
      this.r = r
      this.directionX = Math.floor(Math.random() * 10) - 6
      this.directionY = Math.floor(Math.random() * 10) - 6
      this.opacity = o
      this.speed = s
    }

    Particle.prototype.draw = function (i) {
      if (this.opacity > .03 && this.x <= particles.width && this.y <= particles.height) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r / 1.25, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#FFF';
        ctx.fill()
        ctx.globalAlpha = this.opacity
        ctx.closePath()

        ctxGlow.beginPath();
        ctxGlow.arc(this.x - 1, this.y - 1, this.r, 0, 2 * Math.PI, false);
        ctxGlow.fillStyle = '#FFF';
        ctxGlow.fill()
        ctxGlow.globalAlpha = this.opacity
        ctxGlow.closePath()
      } else {
        particlesContainer.splice(i, 1)
      }
    }

    kick = dancer.createKick({
      threshold: .25,
      onKick: function ( mag ) {
        for (var i = Math.round(50 * mag); i--;) {
          var x = Math.random() * particles.width
                , y = particles.height
                , r = 2
                , s = mag * 8

          particlesContainer.push(new Particle(x, y, r, mag, s))
          particlesContainer.slice(Math.max(particlesContainer.length - 100, 0))
        }
      }
    }).on()

    // Move particles
    setInterval(function () {
      ctx.clearRect(0, 0, particles.width, particles.height)
      ctxGlow.clearRect(0, 0, particlesGlow.width, particlesGlow.height)

      for (var i = particlesContainer.length; i--;) {
        particlesContainer[i].x -= (particlesContainer[i].directionX / 5) * particlesContainer[i].speed
        particlesContainer[i].y -= (particlesContainer[i].directionY / 5) * particlesContainer[i].speed
        particlesContainer[i].opacity -= .0025
        particlesContainer[i].draw(i)
      }
    }, 16.666)
  }

  /*
   * Loading
   */

  function start() {
  
    dancer.play();
    glowDancer.play().setVolume(0)
    feedParticles(particles, particlesGlow)
    document.getElementById('loading').style.display = 'none';
  
    function time() { document.getElementById('time').innerHTML = DateFormat('hh:mm:ss', new Date((dancer.getTime() * 1000) - 57600000)); return time }
  
    setInterval(time(), 1000)
  }

  function loaded () {
    var
      loading = document.getElementById( 'loading' ),
      anchor  = document.createElement('A'),
      supported = Dancer.isSupported(),
      p;
    
    anchor.id = "label"
    
    anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
    anchor.setAttribute( 'href', '#' );
    loading.innerHTML = '';
    loading.appendChild( anchor );

    if ( !supported ) {
      p = document.createElement('P');
      p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
      loading.appendChild( p );
    }

    startOnLoad? start() : anchor.addEventListener( 'click', start);
  }

  if (window.File && window.FileReader && window.FileList && window.Blob) {

    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.

      var reader = new FileReader();
      
      document.getElementById('label').innerHTML = "Loading"
      document.getElementById('label').style.marginLeft = '-470px'

      reader.onload = function(e) {
        
        dancer = new Dancer();
        glowDancer = new Dancer();
        particleDancer = new Dancer();

        var a = new Audio()
        a.src = reader.result
        
        fft.style.webkitFilter = "blur(1px)"
        dancer.fft( fft, { fillStyle: '#FFF' }).load({ src: reader.result });
        
        glow.style.webkitFilter = "blur(7px)"
        glowDancer.fft( glow, { fillStyle: '#FFF' }).load({ src: reader.result });
        
        particlesGlow.style.webkitFilter = "blur(2px)"
        
        !dancer.isLoaded() ? dancer.bind('loaded', loaded) : loaded();
        
        startOnLoad = true
      }
      reader.readAsDataURL(files[0])
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    var dropZone = document.getElementById('dropzone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  }

  // For debugging
  window.dancer = dancer;

})();
