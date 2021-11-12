import { getHourTheta } from './_utils'


function HourHand({
  direction_switch = false,
  offset = 0,
  hand: {
    color = '#fff',
    depth = 60,
    width = 2,
  } = {},
  _now
}) {
  const stroke_width = .5
  const stroke_color = '#000'

  const rotation = getHourTheta({ hours: _now.num_hours, offset, direction_switch })
  return (
    <g
      style={{transform:`rotate(${rotation}deg)`}}
      stroke={stroke_color}
      fill={color}
      strokeWidth={stroke_width}
    >
      <circle cx="0" cy="0" r={width}></circle>
      <polygon points={`${-width},0 ${width},0 .4,${depth} -.4,${depth}`}></polygon>
      <rect
        x={-width + stroke_width} y="-.1"
        width={(width - stroke_width) * 2}
        height={stroke_width}
        stroke={color}
      />
    </g>
  )
}

export default HourHand
