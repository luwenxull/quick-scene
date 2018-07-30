const THREE = require('three')
const { TrackballControls } = require('./lib/TrackballControls')

const default_option = {
  camera: {
    position: [100, 100, 100]
  },
  trackballControl: {
    enabled: false,
    maxDistance: 400,
    minDistance: 100,
  },
  resize: {
    enabled: false,
  }
}

let onResize = null // resize callback

function quickScene(container, option = {}) {
  container.textContent = ''
  const scene = new THREE.Scene()
  const renderer = createRenderer(container)
  const camera = createCamera(container, Object.assign({}, default_option.camera, option.camera || {}))
  const control = enableTrackballControl(
    container,
    camera,
    Object.assign({}, default_option.trackballControl, option.trackballControl || {})
  )
  enableResize(
    container,
    camera,
    renderer,
    Object.assign({}, default_option.resize, option.resize || {})
  )
  renderer.render(scene, camera)
  document.body.appendChild(renderer.domElement)
  return {
    scene,
    renderer,
    camera,
    control,
  }
}

function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(container.clientWidth, container.clientHeight)
  return renderer
}

function createCamera(container, cameraOption) {
  const {clientWidth, clientHeight} = container
  const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
  camera.position.set(...cameraOption.position)
  camera.lookAt(0, 0, 0)
  return camera
}

function enableTrackballControl(container, camera, option) {
  if (option.enabled) {
    const control = new TrackballControls(camera, container)
    // this.control.noPan = true
    if (typeof option.onChange === 'function') {
      control.addEventListener('change', option.onChange)
    }
    control.maxDistance = option.maxDistance
    control.minDistance = option.minDistance
    return control
  }
}

function enableResize(container, camera, renderer, option) {
  if (option.enabled) {
    let resizeId
    onResize = function() {
      if (typeof resizeId === 'number') {
        clearTimeout(resizeId)
      }
      resizeId = setTimeout(() => {
        const width = container.clientWidth, height = container.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }, 0)
    }
    window.addEventListener('resize', onResize)
  }
}

/**
 * 必须调用
 */
function destroy() {
  if (typeof onResize === 'function') {
    window.removeEventListener('resize', onResize)
  }
}

exports.quickScene = quickScene
exports.destroy = destroy