/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

$(document).ready(function() {
  var $sandbox = $('#sandbox');
  var $resetButton = $('#reset-button');
  var $shellToggleButton = $('#shell-toggle-button');
  var $autoplayToggleButton = $('#autoplay-toggle-button');
  var $cpToggleButton = $('#cp-toggle-button');

  var $timeSlider = $('#time-slider');
  $timeSlider.slider({
    min: 0,
    max: 1,
    step: 0.001,
    tooltip_position: 'bottom'
  });

  var _2d = new Two({
    type: Two.Types.svg,
    domElement: $sandbox[0]
  });

  var curve = new Bezier.Curve();
  var highPrecision = 0.01;  // We use this for static curves
  var lowPrecision = 0.1;  // We use this while user is dragging control points

  var mouse = new MouseHandler($sandbox);
  var skeleton = new SkeletonView(curve, highPrecision, _2d);
  var shell = new ShellView(curve, _2d);
  var controlPoints = new ControlPointsView(curve, $sandbox, _2d);
  var autoPlayer = new AutoPlayer(30, 30 / 4000);

  init();

  _2d.bind('update', function() {
    TWEEN.update();

    if ($autoplayToggleButton.prop('checked')) {
      autoPlayer.update();
      setTime(autoPlayer.t);
    }
  }).play();

  function init() {
    updateSandboxSize();
    initCallbacks();
    reset();

    function initCallbacks() {
      $(window).resize(function() {
        updateSandboxSize();
        controlPoints.onResize($sandbox.width(), $sandbox.height());
        skeleton.recompute();
        redraw();
      });

      $sandbox.mousemove(function() { controlPoints.onMouseMove(mouse); });
      $sandbox.mousedown(function() { controlPoints.onMouseDown(); });
      $sandbox.click(function() { controlPoints.onClick(mouse); });

      $shellToggleButton.change(function() {
        shell.layer.visible = $shellToggleButton.prop('checked');
        if (shell.layer.visible) { shell.setTime(getTime()); }
      });
      $cpToggleButton.change(function() {
        controlPoints.layer.visible = $cpToggleButton.prop('checked');
      });

      $timeSlider.change(redraw);
      $timeSlider.change(function() { autoPlayer.t = getTime(); });

      $resetButton.click(reset);

      controlPoints.onAddition(skeleton.recompute.bind(skeleton));
      controlPoints.onAddition(shell.generatePalette.bind(shell));
      controlPoints.onAddition(redraw);
      controlPoints.onDragStart(function() {
        skeleton.precision = lowPrecision;
      });
      controlPoints.onDragStop(function() {
        skeleton.precision = highPrecision;
        skeleton.recompute();
        redraw();
      });
      controlPoints.onDrag(skeleton.recompute.bind(skeleton));
      controlPoints.onDrag(redraw);
    }
  }

  function updateSandboxSize() {
    var w = $sandbox.parent().width();
    var h = $(window).height() - $sandbox.offset().top;
    $sandbox.width(w);
    $sandbox.height(h);
  }

  function redraw() {
    var t = getTime();
    skeleton.setTime(t);
    if (shell.layer.visible) { shell.setTime(t); }
  }

  function reset() {
    curve.clear();

    controlPoints.clear();
    skeleton.recompute();

    shell.layer.visible = $shellToggleButton.prop('checked');
    controlPoints.layer.visible = $cpToggleButton.prop('checked');
    $autoplayToggleButton.prop('checked', false).change();

    var margin = 0.2;
    var offsetX = margin * $sandbox.width();
    var y = $sandbox.height() / 2;
    controlPoints.add(offsetX, y);
    controlPoints.add($sandbox.width() - offsetX, y);

    $timeSlider.slider('setValue', 1, true, true);
  }

  function getTime() { return $timeSlider.slider('getValue'); }
  function setTime(value) { $timeSlider.slider('setValue', value, true, true); }
});