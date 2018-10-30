const THREE = require('three')
const {
  TrackballControls
} = require('./lib/TrackballControls')

const default_option = {
  camera: {
    position: [100, 100, 100]
  },
  trackballControl: {
    enable: false,
    maxDistance: 400,
    minDistance: 100,
  },
  resize: {
    enable: false,
  },
  raycast: {
    enable: false,
    events: [],
  }
}

function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  return renderer
}

function createCamera(container, cameraOption) {
  const {
    clientWidth,
    clientHeight
  } = container
  const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
  camera.position.set(...cameraOption.position)
  camera.lookAt(0, 0, 0)
  return camera
}

function enableTrackballControl(container, camera, option) {
  if (option.enable) {
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

function enableResize(container, camera, option) {
  if (option.enable) {
    let resizeId
    const onResize = function () {
      if (typeof resizeId === 'number') {
        clearTimeout(resizeId)
      }
      resizeId = setTimeout(() => {
        const width = container.clientWidth,
          height = container.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }, 0)
    }
    window.addEventListener('resize', onResize)
    return onResize
  }
}

function quickScene($container, option = {}) {

  /**
   * def
   * onResize
   * mouse
   * rayCaster
   * container
   * scene
   * camera
   * renderer
   * control
   */

  let onResize = null
  let container, scene, camera, renderer, control

  function init() {
    container = $container
    container.textContent = ''
    scene = new THREE.Scene()
    renderer = createRenderer(container)
    camera = createCamera(container, Object.assign({}, default_option.camera, option.camera || {}))
    control = enableTrackballControl(container, camera, Object.assign({}, default_option.trackballControl, option.trackballControl || {}))
    onResize = enableResize(container, camera, Object.assign({}, default_option.resize, option.resize || {}))
    renderer.render(scene, camera)
    $container.appendChild(renderer.domElement)
  }

  function dispose() {
    if (typeof onResize === 'function') {
      window.removeEventListener('resize', onResize)
    }
    onResize = null
    container = null
    scene = null
    camera = null
    renderer.dispose()
    renderer = null
    control.dispose()
    control = null
  }

  init()

  return {
    scene,
    camera,
    renderer,
    dispose,
    control,
  }
}

exports.quickScene = quickScene
