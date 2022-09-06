
import "./../styles/style.css"
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const gui = new dat.GUI();



const three = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 2


  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


  document.body.appendChild(renderer.domElement)


  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load("https://media.datacratie.cc/uploads/400/clipping-1657210869613-833899181.png");

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true;

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)

  const cube = new THREE.Mesh(geometry, material)
  // scene.add(cube)
  scene.add(plane)

  gui.add(cube.position, 'z', -3, 3, 0.01)
  gui.addColor(material, 'color')

  window.addEventListener('resize', (e) => onWindowResize(e), false)
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    render()
  }

  function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    controls.update()
    render()
  }

  function render() {
    renderer.render(scene, camera)
  }

  animate()
}

export default three