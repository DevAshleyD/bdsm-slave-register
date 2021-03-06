/* eslint new-cap: [0] */

var SGen = require('node-sgen');
var bwipjs = require('bwip-js');
var images = require('images');
var Canvas = require('canvas');

function generate(code, path, callback) {
  var sgen = SGen();
  var canvas = new Canvas(300, 200);
  var ctx = canvas.getContext('2d');
  ctx.font = '20px Impact';
  ctx.fillText(sgen.fmtw(code), 22, 15);

  try {
    // generate the SLRN code PNG that goes on top of the main barcode.
    var img = images(canvas.toBuffer());

    bwipjs.loadFont('Inconsolata', 108,
      require('fs').readFileSync(path + '/fonts/Inconsolata.otf', 'binary'));

    bwipjs.toBuffer(
      {
        bcid: 'ean13', // Barcode type
        text: sgen.prefix() + code, // Text to encode
        scale: 2, // 3x scaling factor
        height: 25, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        paddingheight: 14
  //    textalign: 'center', // Always good to set this
  //    textfont: 'Inconsolata', // Use your custom font
  //    textsize: 13 // Font size, in points
      }, function (err, png) {
      if (err) {
        callback(err);
      } else {
        images(png)
          .draw(img, 5, 10)
          .save(path + '/images/' + sgen.fmt(code) + '.png', {
            quality: 50
          });
      }
    });
  } catch (err) {
    callback(err);
  }
}

module.exports = {
  GeneratePng: generate
};
