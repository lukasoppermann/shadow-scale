export default shadowDetails => {
  const properties = [
    'name',
    'type',
    'x',
    'y',
    'radius',
    'spread',
    'color',
    'opacity'
  ]

  const propertyValues = {}

  properties.forEach(property => {
    propertyValues[property] = shadowDetails.querySelector(`[data-property="${property}"]`).value
  })
  // return values
  return propertyValues
}
