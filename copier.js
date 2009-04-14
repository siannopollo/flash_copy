// A much simpler clipboard copying system.
// Important parts taken from http://code.google.com/p/zeroclipboard/

var ZeroClipboard = {
  moviePath: '/javascripts/zero_clipboard/ZeroClipboard.swf',
  dispatch: function(id, eventName, args) {
    var copier = Copier.instance
    if (eventName == 'load') copier.flashObject.setText(copier.element.innerHTML);
    if (eventName == 'mouseOver') copier.element.setStyle('cursor:pointer; color:#800000');
    if (eventName == 'mouseOut') copier.element.setStyle('color:#ac9393');
    if (eventName == 'complete') copier.element.highlight({ duration: 0.5 });
  }, 
};


Copier = Class.create({
  initialize: function(element, container) {
    this.container = $(container);
    this.element = $(element);
    this.movie = $div();
    
    this.container.setStyle('position:relative');
    this.buildMovie();
    this.element.observe('click', function(event) { event.stop() });
    Copier.instance = this;
  },
  
  buildMovie: function() {
    var zIndex = 99;
    var elementZIndex = this.element.getStyle('z-index');
    if (elementZIndex) zIndex = parseInt(elementZIndex) + 1;
    var elementDimensions = this.element.getDimensions();
    
    var height = elementDimensions.height,
        width  = elementDimensions.width
    
    this.movie.setStyle({
      'position': 'absolute',
      'height': height + 'px',
      'width':  width + 'px',
      'top': '0px',
      'left': ((this.container.getWidth() - width) / 2) + 'px',
      'zIndex':zIndex
    });
    
    this.movie.update(this.buildFlashObject(height, width));
    this.container.insert(this.movie);
  },
  
  buildFlashObject: function(height, width) {
    var movie = null
    var id = 'flash_copy_movie_div'
    var flashvars = 'id=' + id + 
      '&width=' + width + 
      '&height=' + height;
      
    if (Prototype.Browser.IE) {
      var protocol = window.location.href.match(/^https/i) ? 'https://' : 'http://';
      var params = []
      params.push($param({ 'name': 'allowScriptAccess', 'value': 'always' }));
      params.push($param({ 'name': 'allowFullScreen', 'value': 'false' }));
      params.push($param({ 'name': 'movie', 'value': ZeroClipboard.moviePath }));
      params.push($param({ 'name': 'loop', 'value': 'false' }));
      params.push($param({ 'name': 'quality', 'value': 'best' }));
      params.push($param({ 'name': 'bgcolor', 'value': '#ffffff' }));
      params.push($param({ 'name': 'flashvars', 'value': flashvars }));
      params.push($param({ 'name': 'wmode', 'value': 'transparent' }));
      
      movie = new Element('object', {
        'classid': 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
        'codebase': protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0',
        'width': width,
        'height': height,
        'align': 'middle',
        'id': id
      });
      params.each(function(p) { movie.insert(p) });
    }
    else {
      movie = new Element('embed', {
        'id': id,
        'src': ZeroClipboard.moviePath,
        'loop': 'false',
        'menu': 'false',
        'quality': 'best',
        'bgcolor': '#ffffff',
        'width': width,
        'height': height,
        'name': id,
        'align': 'middle',
        'allowScriptAccess': 'always',
        'allowFullScreen': 'false',
        'type': 'application/x-shockwave-flash',
        'pluginspage': 'http://www.macromedia.com/go/getflashplayer',
        'flashvars': flashvars,
        'wmode': 'transparent'
      })
    }
    this.flashObject = movie;
    this.flashObject.setStyle('margin:0px; padding:0px');
    return this.flashObject;
  }
});