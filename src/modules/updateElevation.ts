import createStyle from './createStyle'
import { getContainerData, setContainerData, storeKeys } from './containerStore'
import createPreviewElement from './createPreviewElement'
import createElevationLayer from './createElevationLayer'

export default (figma: PluginAPI, container, data) => {
  const focusNodes: SceneNode[] = []
  // remove children nodes
  data.steps = parseInt(data.steps)
  container.children.forEach(child => child.remove())
  // get styles & id
  const containerData = getContainerData(container, storeKeys.ELEVATION_SETTNGS)
  data.containerId = containerData.containerId
  data.styles = containerData.styles || []
  // add updated children nodes
  for (let i = 0; i < data.steps; i++) {
    // get elevation
    const elevation = [...data.elevationLayer].map(layer => {
      return createElevationLayer(i, layer)
    })
    // elevation name
    const elevationName = elevationStyleName(i, data.styleName)
    // create elements
    const previewElements = createPreviewElement(i, elevation)
    // append to container
    container.appendChild(previewElements)
    focusNodes.push(previewElements)
    // create styles
    if (data.createStyles === true) {
      const style = createStyle(elevation, data.styles[i] || null, elevationName)
      data.styles[i] = style.id
    }
    // sync styles is off
    else if (data.styles.length > 0) {
      data.styles.forEach(styleId => {
        figma.getStyleById(styleId).remove()
      })
      // unset styles
      data.styles = []
    }
  }
  // zoom to container if new
  figma.viewport.scrollAndZoomIntoView(focusNodes)
  // elevation settings
  setContainerData(container, storeKeys.ELEVATION_SETTNGS, data)
  // append & select
  figma.currentPage.selection = [container]
}

const elevationStyleName = (i: number, styleName?: string): string => {
  if (styleName !== undefined) {
    const number = String(i).padStart(2, '0')
    if (styleName.indexOf('#') > -1) {
      return styleName.replace('##', number).replace('#', String(i))
    } else {
      return `${styleName} ${number}`
    }
  }
  return null
}
