import * as THREE from 'three'
import GUI from 'lil-gui'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

if ('scrollRestoration' in history) {
   history.scrollRestoration = 'manual'
}

const canvas = document.querySelector('canvas.webgl')
document.body.style.overflow = 'hidden'

/* 
Script 
*/
      const scrollContainer = document.querySelector('#warmth .scroll-row');
      const leftBtn = document.querySelector('#warmth .scroll-left');
      const rightBtn = document.querySelector('#warmth .scroll-right');

      if (scrollContainer && leftBtn && rightBtn) {
      leftBtn.onclick = () => {
         scrollContainer.scrollBy({left: -300, behavior: 'smooth'});
      };
      rightBtn.onclick = () => {
         scrollContainer.scrollBy({left: 300, behavior: 'smooth'});
      };
      }
         

/* 
Debug 
*/
   const gui = new GUI()
   const parameters = {
      materialColor: '#ffeded'
   }

   gui.addColor(parameters, 'materialColor').onChange(function() {
      material.color.set(parameters.materialColor)
      particlesMaterial.color.set(parameters.materialColor)
   })

/* 
LOADING 
*/
   let cassettePlayerX = null
   let introDone = false
   const objectsDistance = 3

   if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
   }

   function resetScroll() {
      setTimeout(() => { window.scrollTo(0, 0) }, 100) 
   }

   window.addEventListener('DOMContentLoaded', resetScroll)
   window.addEventListener('load', resetScroll)

   window.addEventListener('load', function() {
      const overlay = document.querySelector('.overlay')
      const title = document.querySelector('.title')

      setTimeout(() => {
         overlay.classList.add('hidden')
         title.classList.add('visible')
      }, 1000)
   })

/* 
Scene 
*/
   const scene = new THREE.Scene()

/* 
Resize 
*/
   const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
   }

   const baseHeight = 900

   window.addEventListener('resize', function(event) {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      if (cassettePlayerX) {
         const scaleFactor = baseHeight / sizes.height  * 8
         cassettePlayerX.scale.set(scaleFactor, scaleFactor, scaleFactor)

         console.log(scaleFactor)
      }
   })

/* 
Textures 
*/
   const textureLoader = new THREE.TextureLoader()
   const gradientTexture = textureLoader.load('./gradients/3.jpg')
   gradientTexture.magFilter = THREE.NearestFilter

/* 
Objects 
*/
   
   //IMPORTED MODELS
   const loadingManager = new THREE.LoadingManager(function() {
      console.log('player loaded')
   })

   const dracoLoader = new DRACOLoader(loadingManager)
   dracoLoader.setDecoderPath('./draco/')
   const gltfLoader = new GLTFLoader(loadingManager)
   //gltfLoader.setDRACOLoader(dracoLoader)

   
   gltfLoader.load('./CassetePlayer/cassette_player_1k.gltf', function(gltf) {
      cassettePlayerX = new THREE.Group()
      const cassettePlayerY = new THREE.Group()
      cassettePlayerX.add(cassettePlayerY)
      cassettePlayerY.add(gltf.scene)

      if (cassettePlayerX) {
         const scaleFactor = baseHeight / sizes.height * 8
         cassettePlayerX.scale.set(scaleFactor, scaleFactor, scaleFactor)
      }
      cassettePlayerX.rotation.set(-0.7, 0, 0)
      gltf.scene.position.set(0, 0, 0)

      cassettePlayerX.position.set(0, -5, 0)
      scene.add(cassettePlayerX)

      window.scrollTo(0, 0)
      ScrollTrigger.refresh()

      gsap.fromTo(
         cassettePlayerX.position, 
         { y: -5 },
         {
            y: -1.2,        // финальная позиция
            duration: 1, // 3 секунды
            ease: "power2.out",
            delay: 0,   // подождать пока чёрный экран исчезнет
            onComplete: function() { 
               introDone = true 
               document.body.style.overflow = 'auto'
            }
         }
      )

      const timeLine = gsap.timeline({
         scrollTrigger: {
            trigger: '#timeLine1',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            markers: true
         }
      })//.fromTo(cassettePlayerX.position, 
         //{ y: -1.2, z: 0 },
         //{ y: -1.2, z: 1})
        .to(cassettePlayerX.position, { y: '-=2.1', z: '+=1' })
        .to(cassettePlayerX.position, { x: 1, y: '-=3.4', z: 0 })
        .to(cassettePlayerX.rotation, { x: '+=0.7' }, '<')
        .to(cassettePlayerY.rotation, { y: -0.5 }, '<')

      ScrollTrigger.create({
         trigger: "#warmth",
         start: 'bottom center'
      })

      ScrollTrigger.create({
         trigger: '#cards',
         start: 'top center',
         onEnter: function() {
            if (cassettePlayerX) {
               gsap.set(cassettePlayerX.position, { x: -2, y: -16.8, z: 1})
               gsap.set(cassettePlayerY.rotation, { x: 0, y: 0.5, z: 0})
               gsap.set(cassettePlayerX.rotation, { x: 0, y: 0, z: Math.PI / 2}, '<')
            }
         },
         onLeaveBack: function() {
            if (cassettePlayerX) {
               // Вернуть в исходное положение и поворот
               gsap.set(cassettePlayerX.position, { x: 1, y: -6.6, z: 0 }) // значения подберите под вашу сцену
               gsap.set(cassettePlayerY.rotation, { y: -0.5 })
               gsap.set(cassettePlayerX.rotation, { x: 0, y: 0, z: 0 })
            }
         }
      })

      const timeLine2 = gsap.timeline({
         scrollTrigger: {
            trigger: '#timeLine2',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            markers: true
         }
      }).to(cassettePlayerX.position, { x: 4 })
        .to(cassettePlayerX.position, { y: '-=6'})
        .to(cassettePlayerX.rotation, { z: -Math.PI / 2}, '<')
        .to(cassettePlayerX.position, { x: 2})
      
   })

   /* function nameScrollAnimation() {
      gsap.to(cassettePlayerX.position, {
         y: -2.4,
         z: 1.5,
         duration: 1,
         ease: 'power2.out',
         scrollTrigger: {
            trigger: '#name',
            start: 'top center',
            end: 'center center',
            scrub: true,
            markers: true,
            onComplete: function() {
               stillScrollAnimation()
            }
         }
      })
   }

   function stillScrollAnimation() {
      gsap.to(cassettePlayerX.position, {
         x: 1,
         y: -2.4,
         z: 1.5,
         duration: 1,
         ease: 'power2.out',
         scrollTrigger: {
            trigger: '#still',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            markers: true
         }
      })
   } */
   
/* 
Light 
*/
   const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
   directionalLight.position.set(1, 3, 2)
   scene.add(directionalLight)

   const ambientLight = new THREE.AmbientLight(0xffffff, 7)
   scene.add(ambientLight)

/* 
Camera 
*/
   //Group
   const cameraGroup = new THREE.Group()
   scene.add(cameraGroup)

   //Camera
   const camera = new THREE.PerspectiveCamera(35, sizes.width/sizes.height, 0.1, 100)
   camera.position.set(0, 0, 5)
   cameraGroup.add(camera)

/* 
Controls 
*/
   //const controls = new OrbitControls(camera, canvas)
   //controls.enableDamping = true

   //camera.lookAt(new THREE.Vector3(0, camera.position.y, 0))

/* 
Render 
*/
   const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
   })
   renderer.setSize(sizes.width, sizes.height)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

   renderer.shadowMap.enabled = true

/* 
Scroll
*/
   let scrollY = window.scrollY
   let currentSection = 0

   window.addEventListener('scroll', function() {
      scrollY = this.window.scrollY
   })

/* 
Cursor 
*/
   const cursor = {}
   cursor.x = 0
   cursor.y = 0

   window.addEventListener('mousemove', function(event) {
      cursor.x = (event.clientX / sizes.width) - 0.5
      cursor.y = (event.clientY / sizes.height) - 0.5
   })

/* 
Animation 
*/
   const clock = new THREE.Clock
   let previousTime = 0

   function animationFlow() {
      //Pace control
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      //Camera
      camera.position.y = -scrollY / sizes.height * objectsDistance 

      //const parallaxX = cursor.x
      //const parallaxY = -cursor.y
      //cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 0.2
      //cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 0.2

      
         
      

      //Mixer update
      /* if(mixer != null) {
         mixer.update(deltaTime)
      } */

      //controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(animationFlow)
   }
animationFlow()