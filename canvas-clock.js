// https://codepen.io/gissehel/pen/PbNZOq

(function () {
  var Clock, clock;

  Clock = (function () {
    var Colors, HandProps, Palette;

    HandProps = {
      hour12: {
        begin: 1,
        end: 12,
        offset: 3
      },
      hour24: {
        begin: 0,
        end: 23,
        offset: 12
      },
      minute: {
        begin: 1,
        end: 60,
        offset: 15
      },
      second: {
        begin: 1,
        end: 60,
        offset: 15
      }
    };

    Colors = {
      light: '#fff',
      shadow: '#000',
      element: '#333',
      second: '#f00'
    };

    Palette = {
      brightlava: ['#300303', '#490a04', '#611405', '#792306', '#913608', '#aa4c09', '#c2660a', '#da840b', '#f2a60d', '#f4c025', '#f5d63d', '#f6e955', '#f7f76e'],
      sunset: ['#000066', '#150080', '#330099', '#5900b3', '#8800cc', '#bf00e6', '#ff00ff', '#ff1ad9', '#ff33bb', '#ff4da6', '#ff6699', '#ff8095', '#ff9999'],
      sunset2: ['#090317', '#1c0634', '#390950', '#5e0c6d', '#8a0f86', '#a61286', '#c3167e', '#e0196c', '#e8305b', '#eb4d55', '#ee7c6a', '#f2a887', '#f5cca3'],
      autumn: ['#001a00', '#063300', '#134d00', '#266600', '#408000', '#609900', '#86b300', '#b3cc00', '#e5e600', '#ffdf00', '#ffc61a', '#ffb333', '#ffa64d'],
      custom: ['#000', '#ff6a00', '#12318a']
    };

    function Clock(params) {
      this.color = Colors.element;
      this.color_second = Colors.second;
      this.h_size = 22;
      this.m_size = 11;
      this.effect_width = 2;
      this.hand_props_hour = HandProps.hour24;
      this.palette = 'brightlava';
      if (params === void 0) {
        params = {};
      }
      if (params.color !== void 0) {
        this.color = params.color;
      }
      if (params.color_second !== void 0) {
        this.color_second = params.color_second;
      }
      if (params.canvas !== void 0) {
        this.canvas = params.canvas;
      }
      if (params.parent !== void 0 && this.canvas === void 0) {
        this.parent = params.parent;
      }
      if (params.width !== void 0) {
        this.width = params.width;
      }
      if (params.height !== void 0) {
        this.height = params.height;
      }
      if (params.h_size !== void 0) {
        this.h_size = params.h_size;
      }
      if (params.m_size !== void 0) {
        this.m_size = params.m_size;
      }
      if (params.effect_width !== void 0) {
        this.effect_width = params.effect_width;
      }
      if (params.use_12 !== void 0) {
        if (params.use_12) {
          this.hand_props_hour = HandProps.hour12;
        }
      }
      if (params.palette !== void 0) {
        this.palette = params.palette;
      }
      if (params.events !== void 0) {
        this.events = params.events;
      }
      if (this.width === void 0) {
        if (this.canvas === void 0) {
          this.width = 500;
        } else {
          this.width = this.canvas.width;
        }
      }
      if (this.height === void 0) {
        if (this.canvas === void 0) {
          this.height = 500;
        } else {
          this.height = this.canvas.height;
        }
      }
      if (this.canvas !== void 0) {
        if (this.parent === void 0) {
          this.parent = this.canvas.parentElement;
        }
      }
      if (this.canvas === void 0) {
        if (this.parent === void 0) {
          this.parent = document.body;
        }
        this.canvas = document.createElement('canvas');
        this.parent.appendChild(this.canvas);
      }
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.clock_radius = Math.min(this.ctx.canvas.width, this.ctx.canvas.height) / 2;
      return;
    }

    Clock.prototype.clean = function () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    };

    Clock.prototype.with_effect = function (color, code) {
      var index, _i, _j, _ref, _ref1;
      if (this.effect_width > 0) {
        for (index = _i = 1, _ref = this.effect_width; 1 <= _ref ? _i <= _ref : _i >= _ref; index = 1 <= _ref ? ++_i : --_i) {
          // this.save();
          // this.ctx.translate(0, index);
          // this.ctx.fillStyle = Colors.shadow;
          // this.ctx.globalAlpha = 0.5;
          // code();
          // this.restore();
        }
        for (index = _j = 1, _ref1 = this.effect_width; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; index = 1 <= _ref1 ? ++_j : --_j) {
          this.save();
          this.ctx.translate(0, -index);
          this.ctx.fillStyle = Colors.light;
          this.ctx.globalAlpha = 0.5;
          code();
          this.restore();
        }
      }
      this.save();
      this.ctx.fillStyle = color;
      code();
      this.restore();
    };

    Clock.prototype.get_theta = function (value, hand_props) {
      return (value - hand_props.offset) * 2 * Math.PI / (hand_props.end - hand_props.begin + 1);
    };

    Clock.prototype.get_xy = function (length, theta) {
      return [this.clock_radius * length * Math.cos(theta), this.clock_radius * length * Math.sin(theta)];
    };

    Clock.prototype.iterate_on_hand = function (hand_props, code) {
      var theta, value, _i, _ref, _ref1;
      for (value = _i = _ref = hand_props.begin, _ref1 = hand_props.end; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; value = _ref <= _ref1 ? ++_i : --_i) {
        theta = this.get_theta(value, hand_props);
        code(value, hand_props, theta);
      }
    };

    Clock.prototype.draw_hand = function (value, hand_props, width, length, color) {
      var theta;
      theta = this.get_theta(value, hand_props);
      return this.with_effect(color, (function (_this) {
        return function () {
          _this.ctx.rotate(theta);
          _this.ctx.beginPath();
          _this.ctx.moveTo(-15, -width);
          _this.ctx.lineTo(-15, width);
          _this.ctx.lineTo(_this.clock_radius * length, 1);
          _this.ctx.lineTo(_this.clock_radius * length, -1);
          _this.ctx.fill();
        };
      })(this));
    };

    Clock.prototype.draw_tick = function (value, theta, radius, length, color) {
      var x, y, _ref;
      _ref = this.get_xy(length, theta), x = _ref[0], y = _ref[1];
      return this.with_effect(color, (function (_this) {
        return function () {
          _this.ctx.beginPath();
          _this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
          _this.ctx.closePath();
          _this.ctx.fill();
        };
      })(this));
    };

    Clock.prototype.draw_text = function (value, theta, text_size, length, color) {
      var x, y, _ref;
      _ref = this.get_xy(length, theta), x = _ref[0], y = _ref[1];
      return this.with_effect(color, (function (_this) {
        return function () {
          _this.ctx.font = text_size + 'px Sans-Serif';
          _this.ctx.fillText(value, x, y);
        };
      })(this));
    };

    Clock.prototype.draw_arc = function (hour1, hour2, hand_props, length_min, length_max, color, globalAlpha=.5) {
      var radius_max, radius_min, theta1, theta2;
      theta1 = this.get_theta(hour1, hand_props);
      theta2 = this.get_theta(hour2, hand_props);
      radius_min = this.clock_radius * length_min;
      radius_max = this.clock_radius * length_max;
      return this.with_effect(color, (function (_this) {
        return function () {
          _this.ctx.globalAlpha = globalAlpha;
          _this.ctx.beginPath();
          _this.ctx.arc(0, 0, radius_max, theta1, theta2, false);
          _this.ctx.arc(0, 0, radius_min, theta2, theta1, true);
          _this.ctx.closePath();
          _this.ctx.fill();
        };
      })(this));
    };

    Clock.prototype.draw_event = function (event) {
      var hour_range, _i, _len, _ref;
      _ref = event.hour_ranges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hour_range = _ref[_i];
        this.draw_arc(hour_range[0], hour_range[1], this.hand_props_hour, 0.2 + 0.05 * event.level, 0.3 + 0.05 * event.level, Palette[this.palette][event.color_index]);
      }
    };

    Clock.prototype.draw_events = function (events) {
      var event, _i, _len;
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        this.draw_event(event);
      }
    };

    Clock.prototype.save = function () {
      this.ctx.save();
    };

    Clock.prototype.restore = function () {
      this.ctx.restore();
    };

    Clock.prototype.draw_scene = function () {
      var date, hours, minutes, numHour, numMinute, seconds;
      this.save();
      this.clean();
      date = new Date;
      hours = date.getHours();
      minutes = date.getMinutes();
      seconds = date.getSeconds();
      numMinute = minutes + seconds / 60;
      numHour = hours + numMinute / 60;

      this.draw_arc(0, 24, this.hand_props_hour, .59,.61,'#fff', .9)
      this.draw_hand(numMinute, HandProps.minute, 1, 0.9, '#999');
      this.iterate_on_hand(this.hand_props_hour, (function (_this) {
        return function (value, hand_props, theta) {
          if (value === hours) {
            _this.draw_text(value, theta+.02, _this.h_size, 0.68, '#fff');
            _this.draw_text(value, theta-.02, _this.h_size, 0.68, '#fff');
            _this.draw_text(value, theta, _this.h_size, 0.67, '#fff');
            _this.draw_text(value, theta, _this.h_size, 0.69, '#fff');
            _this.draw_text(value, theta, _this.h_size, 0.68, _this.color);
          }
          if (value%6 === 0) {
            _this.draw_tick(value, theta, 3.5, 0.6, _this.color);
          } else if (value%3 === 0) {
            _this.draw_tick(value, theta, 2.5, 0.6, _this.color);
          } else {
            _this.draw_tick(value, theta, 1, 0.6, _this.color);
          }
          // if (value === hours+1)
          //   _this.draw_text(value, theta, _this.h_size/3, 0.68, '#999');
        };
      })(this));
      this.iterate_on_hand(HandProps.minute, (function (_this) {
        return function (value, hand_props, theta) {
          if(value === minutes){
            _this.draw_text(value, theta, 30, .8, '#666');
            // _this.draw_tick(value, theta, 1, 0.89, _this.color);
          }
          // if (value % 5 === 0) {
          //   _this.draw_text(value, theta, _this.m_size, 0.89, _this.color);
          // } else {
          // }
        };
      })(this));
      if (this.events !== void 0) {
        this.draw_events(this.events);
      }
      this.draw_hand(numHour, this.hand_props_hour, 7, 0.5, this.color_second);
      // this.draw_hand(seconds, HandProps.second, 3, 0.9, this.color_second);
      this.restore();
    };

    Clock.prototype.start = function () {
      this.draw_scene();

      setInterval(((function (_this) {
        return function () {
          _this.draw_scene();
        };
      })(this)), 1000*60);
    };

    return Clock;

  })();

  clock = new Clock({
    color: '#333',
    effect_width: 1,
    use_12: false,
    width: 650,
    height: 650,
    h_size: 60,
    m_size: 11,
    palette: 'custom',
    canvas: document.querySelector('#clock'),
    events: [
      {
      //   hour_ranges: [[8, 12], [13, 17]],
      //   level: 1,
      //   color_index: 3
      // }, {
      //   hour_ranges: [[11, 12], [13, 20]],
      //   level: 2,
      //   color_index: 6
      // }, {
        hour_ranges: [[22, 5.5]],
        level: 6,
        color_index: 0
      }, {
        hour_ranges: [[5,6.5]],
        level: 6,
        color_index: 1
      }, {
        hour_ranges: [[17, 20.5]],
        level: 6,
        color_index: 2
      }
    ]
  });

  clock.start();

}).call(this);
