(function () {

  var dance = document.getElementById( 'dancer' )
    , glow = document.getElementById( 'dancer2' )
    , particles = document.getElementById( 'dancer3' )
    , particlesGlow = document.getElementById( 'dancer4' )
    , startOnLoad = false
    , loading = document.getElementById('loading')
  
  if (window.File && window.FileReader && window.FileList && window.Blob) {
  
    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  
      var files = evt.dataTransfer.files; // FileList object.
  
      var reader = new FileReader();
      
      document.getElementById('label').innerHTML = "Loading"
  
      reader.onload = function () {
        startOnLoad = true
        
        setup({ src: reader.result })
      }
      
      reader.readAsDataURL(files[0])
    }
  
    function handleDragOver(evt) {
      evt.stopPropagation()
      evt.preventDefault()
      document.getElementById('label').innerHTML = 'drop'
      evt.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
    }
    
    function handleDragOff(evt) {
      document.getElementById('label').innerHTML = 'play'
    }
  
    var dropZone = document.getElementById('dropzone')
      , container = document.getElementById('container')
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    dropZone.addEventListener('dragleave', handleDragOff, false);
    container.addEventListener('dragover', handleDragOver, false);
    container.addEventListener('drop', handleFileSelect, false);
    container.addEventListener('dragleave', handleDragOff, false);
  }
  
  function setup(src) {
    dancer = new Dancer();
    dancer.dance( dance, { fillStyle: '#FFF' }).load(src);
    
    Dancer.isSupported() || loaded();
    !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();
  }
  
  // Draw bars
  CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, r) {
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
      this.fill();
  };

  // Feed bars
  Dancer.addPlugin( 'dance', function( canvasEl, options ) {
    var ctx     = canvasEl.getContext( '2d' )
      , ctxGlow = glow.getContext('2d')
      , h       = canvasEl.height
      , w       = canvasEl.width
      , barWidth   = 6
      , spectrum

    ctx.fillStyle = '#FFF'
    ctxGlow.fillStyle = '#FFF'

    this.bind('update', function() {
      spectrum = this.getSpectrum()
      ctx.clearRect(0, 0, w, h)
      ctxGlow.clearRect(0, 0, w, h)
      
      for (var i = 0, l = spectrum.length; i < l; i++) {
        ctx.fillRoundRect( i * barWidth, h, barWidth, -spectrum[ i ] * h * 4, 3)
        ctxGlow.fillRoundRect( i * barWidth, h, barWidth, -spectrum[ i ] * h * 4, 3)
      }
    });

    return this;
  });

  setup({ src: 'sounds/clarity', codecs: [ 'mp3' ] })

  function feedParticles(particles, particlesGlow) {
    var ctx = particles.getContext( '2d' )
      , ctxGlow = particlesGlow.getContext('2d')
      , particlesContainer = []

    // Make particles on kick
    kick = dancer.createKick({
      threshold: .3,
      onKick: function (mag) {
        for (var i = Math.round(15 * mag); i--;) {
          var x = Math.random() * particles.width
            , y = particles.height
            , r = 3
            , s = mag * 5 * Math.random()
    
          if (!hidden()) particlesContainer.push(new Particle(x, y, r, mag, s))
        }
      }
    }).on()
    
    // Move particles
    setInterval(function () {
      if (!hidden()) {
        ctx.clearRect(0, 0, particles.width, particles.height)
        ctxGlow.clearRect(0, 0, particlesGlow.width, particlesGlow.height)
        
        for (var i = particlesContainer.length; i--;) {
          particlesContainer[i].x -= (particlesContainer[i].directionX / 5) * particlesContainer[i].speed
          particlesContainer[i].y -= particlesContainer[i].speed
          particlesContainer[i].opacity -= .004
          particlesContainer[i].draw(i)
        }
      }
    }, 16.666)

    // Particle class
    function Particle(x, y, r, o, s) {
      this.x = x
      this.y = y
      this.r = r
      this.directionX = Math.floor(Math.random() * 8) - 4
      this.opacity = o
      this.speed = s
    }

    Particle.prototype.draw = function (i) {
      if (this.opacity > .03 && this.x <= particles.width && this.y <= particles.height) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#FFF';
        ctx.fill()
        ctx.globalAlpha = this.opacity
        ctx.closePath()

        ctxGlow.beginPath();
        ctxGlow.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctxGlow.fillStyle = '#FFF';
        ctxGlow.fill()
        ctxGlow.globalAlpha = this.opacity
        ctxGlow.closePath()
      } else {
        particlesContainer.splice(i, 1)
      }
    }
  }

  // Start the music
  function start() {
  
    dancer.play();
    feedParticles(particles, particlesGlow)
    loading.style.display = 'none';
    document.getElementById('drop-label').style.display = 'none';
  
    function time() { document.getElementById('time').innerHTML = DateFormat('hh:mm:ss', new Date((dancer.getTime() * 1000) - 57600000)); return time }
  
    setInterval(time(), 1000)
  }

  // Callback for after the song has loaded
  function loaded() {
    var
      loading = document.getElementById( 'loading' ),
      anchor  = document.createElement('A'),
      supported = Dancer.isSupported(),
      p;
    
    anchor.id = "label"
    
    anchor.appendChild( document.createTextNode( supported ? 'Play' : 'Close' ) );
    anchor.setAttribute( 'href', '#' );
    loading.innerHTML = '';
    loading.appendChild( anchor );

    if ( !supported ) {
      p = document.createElement('P');
      p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
      loading.appendChild( p );
    }

    startOnLoad? start() : anchor.addEventListener( 'click', start)
  }

  // A tiny time formatter library
  function DateFormat(formatString,date) {
  
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

  function hidden() {
    if (typeof document.webkitHidden !== 'undefined') return document.webkitHidden
    if (typeof document.hidden !== 'undefined') return document.hidden
    return false
  }
})();
