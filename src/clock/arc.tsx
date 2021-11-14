// https://stackoverflow.com/a/43211655/2130750
function polarToCartesian(x=0, y=0, radius=5, angle=0) {
  var angleInRadians = (angle + 90) * Math.PI / 180.0
  return {
    x: x + (radius * Math.cos(angleInRadians)),
    y: y + (radius * Math.sin(angleInRadians))
  }
}

function Arc({
  type = '',
  x = 0,
  y = 0,
  depth = 10,
  spread = 3,
  start_angle = 0,
  end_angle = 45,
  // arc_angle = 45,
  ...other_props
}){
  // const end_angle = start_angle + arc_angle
  const inner_start = polarToCartesian(x, y, depth, end_angle)
  const inner_end = polarToCartesian(x, y, depth, start_angle)
  let outer_start = polarToCartesian(x, y, depth + spread, end_angle)
  let outer_end = polarToCartesian(x, y, depth + spread, start_angle)
  const large_arc_flag = +!(end_angle - start_angle <= 180)

  let d = [
    'M', outer_start.x, outer_start.y,
    'A', depth + spread, depth + spread, 0, large_arc_flag, 0, outer_end.x, outer_end.y,
    'L', inner_end.x, inner_end.y,
    'A', depth, depth, 0, large_arc_flag, 1, inner_start.x, inner_start.y,
    'L', outer_start.x, outer_start.y, 'Z'
  ].join(' ')

  if (type === 'text-ref') {
    const offset = +(other_props?.strokeWidth || 0) + spread/10
    outer_start = polarToCartesian(x, y, depth + spread - offset, end_angle)
    outer_end = polarToCartesian(x, y, depth + spread - offset, start_angle)
    d = [
      'M', outer_start.x, outer_start.y,
      'A', depth + spread, depth + spread, 0, large_arc_flag, 0, outer_end.x, outer_end.y,
    ].join(' ')
    return <path d={d} opacity="0" transform={other_props?.transform} id={other_props?.id}></path>
  }

  return (
    <path d={d} {...other_props}></path>
  )
}

export default Arc
