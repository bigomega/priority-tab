function Progress({
  split = 4,
  percent = 0,
  height = 2,
  width = 25,
  color = '#fff',
  bg = '#0003',
  y_offset = 2,
  stroke_width = .5,
}) {
  const progress_width = (percent * width) - stroke_width

  return (
    <g>
      <rect
        width={width}
        height={height}
        stroke="#000"
        strokeWidth={stroke_width}
        fill={bg}
        x="0"
        y={y_offset}
      ></rect>
      <rect
        width={progress_width > 0 ? progress_width : 0}
        height={height - stroke_width}
        strokeWidth={0}
        stroke="#000"
        fill={color}
        x={stroke_width / 2}
        y={y_offset + stroke_width / 2}
      ></rect>
      <g>
        {[...Array(split)].map((_, i) => {
          const split_x_offset = width * i / split
          return (
            <line
              key={i}
              x1={split_x_offset}
              y1={y_offset}
              x2={split_x_offset}
              y2={height + y_offset}
              strokeWidth={stroke_width}
              stroke='#0009'
            ></line>
          )
        })}
      </g>
    </g>
  )
}

export default Progress
