export default {
  // direction_switch: false,
  second_ripple: true,
  second_ripple_color: '#f0f',
  location_marker: false,
  minute: { show_hand: true },
  background_opacity: .3,
  hour: {
    hand: {
      // width: 1,
      depth: 50,
      // color: 'yellow',
    },
    marker: {
      // is24h: false,
      text: {
        split: 0,
        // depth: 70,
      },
      dot: {
        // size: 1.5,
        // depth: 24.5,
        // dot_skip_current: false,
      },
      now: {
        // display: false,
        minutes: false,
          seconds_ticker: false,
            minute_progress: {
          display: true,
            height: 1,
          // bg: '#000'
          // width: 30,
          // split: 4 * 3,
        },
      }
    },
  },
  events: {
    // spread: 8+2,
    // depth: 62.5-2,
    inactive_opacity: .65,
    list: [
      {
        from: 515,
        to: 700,
        color: '#ff9300',
        text: ' 🦮 🌤',
      }, {
        from: 1700,
        to: 2000,
        stroke_width: .4,
        color: '#781bff',
        text: '🦮  🏋️  🚿',
      }, {
        from: 2130,
        to: 500,
        color: '#111',
        text: ' SLEEP 🛌 (8.5h)',
        text_color: '#999',
        page_background_image_tags: ['night,sleep', 'stars'],
        // }, {
        //   at: 510,
        //   text: '🍌',
        //   spread: 12,
        //   depth: 52,
      }, {
        at: 750,
        text: '🥪',
        depth: 50,
        spread: 12,
      }, {
        at: 1300,
        text: '🍛',
        depth: 55,
        spread: 12,
        at_text_offset_deg: -15,
        // }, {
        //   at: 1720,
        //   text: '☕️',
        //   depth: 60,
        //   spread: 12,
      }, {
        at: 2000,
        text: '🍕',
        spread: 12,
        depth: 65,
        // at_highlight_duration: 2,
        // at_text_offset_deg: -5,
      }
    ]
  },
}
