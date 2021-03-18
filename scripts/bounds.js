export const boundsCheck = (spin, tetromino) => {
  const adjust = {
    x: 0,
    y: 0,
  }
  tetromino.forEach(({ x, y }, index) => {
    const targetY = y + spin.y[index]
    const targetX = x + spin.x[index]

    function checkSides(target, plane) {
      const upperBound = plane === 'y' ? 9 : 19
      if (target < 0) {
        adjust[plane] = Math.max(adjust[plane], Math.abs(target))
      } else if (target > upperBound) {
        adjust[plane] = Math.min(adjust[plane], upperBound - target)
      }
    }

    checkSides(targetY, 'y')
    checkSides(targetX, 'x')
  })
  return adjust
}
