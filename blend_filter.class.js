(function(global){
  'use strict';

  var fabric = global.fabric;

  /**
   * Color Blend filter class
   * @class fabric.Image.filter.Blend
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @example
   * var filter = new fabric.Image.filters.Blend({
   *  color: '#000',
   *  mode: 'multiply'
   * });
   *
   * var filter = new fabric.Image.filters.Blend({
   *  image: fabricImageObject,
   *  mode: 'multiply',
   *  alpha: 0.5
   * });

   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  fabric.Image.filters.Blend = fabric.util.createClass({
    type: 'Blend',

    initialize: function(options){
      options = options || {};
      this.color = options.color || '#000';
      this.image = options.image || false;
      this.mode = options.mode || 'multiply';
      this.alpha = options.alpha || 1;
    },

    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
      imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
      data = imageData.data,
      tr, tg, tb, r, g, b, source, 
      isImage = false;

      if(this.image){
        // Blend images
        isImage = true;

        var _el = document.createElement('canvas');
        _el.width = this.image.width;
        _el.height = this.image.height;

        var _tmp_canvas = new fabric.StaticCanvas(_el);
        _tmp_canvas.add(this.image);
        var context2 =  _tmp_canvas.getContext('2d');
        source = context2.getImageData(0, 0, _tmp_canvas.width, _tmp_canvas.height).data;
      } else {
        // Blend color 
        source = new fabric.Color(this.color).getSource();

        tr = source[0] * this.alpha;
        tg = source[1] * this.alpha;
        tb = source[2] * this.alpha;
      }

      for (var i = 0, len = data.length; i < len; i += 4) {

        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        if(isImage){
          tr = source[i] * this.alpha;
          tg = source[i + 1] * this.alpha;
          tb = source[i + 2] * this.alpha;
        }

        switch(this.mode){
          case 'multiply':
            data[i] = r * tr / 255;
            data[i + 1] = g * tg / 255;
            data[i + 2] = b * tb / 255;
            break;
          case 'screen':
            data[i] = 1 - (1-r) * (1-tr);
            data[i + 1] = 1 - (1-g) * (1-tg);
            data[i + 2] = 1 - (1-b) * (1-tb);
            break;
          case 'add':
            data[i] = Math.min(255, r + tr);
            data[i + 1] = Math.min(255, g + tg);
            data[i + 2] = Math.min(255, b + tb);
            break;
          case 'diff':
            data[i] = Math.abs(r - tr);
            data[i + 1] = Math.abs(g - tg);
            data[i + 2] = Math.abs(b - tb);
            break;
        }
      }

      context.putImageData(imageData, 0, 0);
    }
  });

  fabric.Image.filters.Blend.fromObject = function(object) {
    return new fabric.Image.filters.Blend(object);
  };
})(typeof exports !== 'undefined' ? exports : this);
