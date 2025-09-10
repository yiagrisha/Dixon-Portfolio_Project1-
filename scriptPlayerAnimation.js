import * as THREE from 'three'
import GUI from 'lil-gui'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

if ('scrollRestoration' in history) { history.scrollRestoration = 'manual' }
const canvas = document.querySelector('canvas.webgl')
document.body.style.overflow = 'hidden'

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
Loading 
*/
   let cassettePlayerX = null
   let cassettePlayerY = null
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
      window.scrollTo(0, 0)
      ScrollTrigger.refresh()

      cassettePlayerX = new THREE.Group()
      cassettePlayerY = new THREE.Group()

      cassettePlayerX.add(cassettePlayerY)
      cassettePlayerY.add(gltf.scene)
      gltf.scene.position.set(-0.005, 0, -0.025)

      if (cassettePlayerX) {
         const scaleFactor = baseHeight / sizes.height * 8
         cassettePlayerX.scale.set(scaleFactor, scaleFactor, scaleFactor)
      }

      gsap.set(cassettePlayerX.position, { 
         x: 0,
         y: -5,
         z: 0
      })
      gsap.set(cassettePlayerX.rotation, { x: -0.7, y: 0, z: 0 })
      gsap.set(cassettePlayerY.rotation, { x: 0, y: 0, z: 0 })
      scene.add(cassettePlayerX)

      setTimeout(() => {
         gsap.fromTo(
            cassettePlayerX.position, 
            { y: -5 }, {
               y: -0.8,
               duration: 1,
               ease: "power2.out",
               delay: 0,
               onComplete: function() { 
                  introDone = true 
                  document.body.style.overflow = 'auto'
               }
            }
         )

      }, 3000)

      setTimeout(() => {
         window.scrollTo(0, 0)
         ScrollTrigger.refresh()
         initialiseTriggers()
      }, 100)
   })

   function initialiseTriggers() {
      const timeLine = gsap.timeline({
         scrollTrigger: {
            trigger: '#timeLine1',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            markers: true,
            onEnterBack: function() {
               if (cassettePlayerX) {
                  gsap.set(cassettePlayerX.position, { x: 0, y: 4, z: 1 })
                  gsap.set(cassettePlayerY.rotation, { x: 0, y: 0, z: 0 })
                  gsap.set(cassettePlayerX.rotation, { x: 0, y: 0, z: 0 })
               }
            }
         }
      }).to(cassettePlayerX.position, { y: 0, z: '+=1' })
      
        .to(cassettePlayerX.position, { z: 1 })

        .to(cassettePlayerX.position, { z: 1 })
        .to(cassettePlayerX.rotation, { x: '+=0.7' }, '<')

        .to(cassettePlayerY.rotation, { y: Math.PI * 2 / 8})

        .to(cassettePlayerY.rotation, { y: (Math.PI * 2 / 8) * 2 })

        .to(cassettePlayerY.rotation, { y: (Math.PI * 2 / 8) * 3 })

        .to(cassettePlayerY.rotation, { y: (Math.PI * 2 / 8) * 4 })

        .to(cassettePlayerY.rotation, { y: (Math.PI * 2 / 8) * 5 })
        
        .to(cassettePlayerY.rotation, { y: (Math.PI * 2 / 8) * 6 })

        .to(cassettePlayerY.rotation, { y: (Math.PI * 2 / 8) * 7 })

        .to(cassettePlayerY.rotation, { y: Math.PI * 2 })

        .to(cassettePlayerX.position, { y: 3 })

      ScrollTrigger.create({
         trigger: "#warmth",
         start: 'bottom center'
      })

      ScrollTrigger.create({
         trigger: '#scroll-points',
         start: 'top center',
         onEnter: function() {
            if (cassettePlayerX) {
               gsap.set(cassettePlayerX.position, { x: -1, z: 1})
               gsap.set(cassettePlayerY.rotation, { x: 0, z: 0})
               gsap.set(cassettePlayerX.rotation, { x: 0, z: Math.PI / 2})
            }
         },
         onLeaveBack: function() {
            if (cassettePlayerX) {
               // Вернуть в исходное положение и поворот
               gsap.set(cassettePlayerX.position, { x: 1, y: -6.6, z: 0 }) 
               gsap.set(cassettePlayerY.rotation, { y: -0.5 })
               gsap.set(cassettePlayerX.rotation, { x: 0, y: 0, z: 0 })
            }
         }
      })
   }

   gsap.to("#ritual-image", {
   opacity: 1,
   duration: 1.2,
   ease: "power2.out",
   scrollTrigger: {
      trigger: "#ritual",
      start: "top 20%", 
      toggleActions: "play none none reverse"
   }
   })

   gsap.fromTo("#analog h2", {
      opacity: 0,     // невидимый
      scale: 0.85,    // чуть уменьшенный
      z: -150         // как будто отодвинут назад
   }, {
      opacity: 1,     // проявляется
      scale: 1,       // возвращается к норме
      z: 0,           // выезжает «из глубины»
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
         trigger: "#analog h2",
         start: "top 70%",     // анимация начнётся, когда заголовок окажется внизу экрана
         toggleActions: "play none none reverse"
      }
   })

   ScrollTrigger.create({
   trigger: "#ritual",
   start: "top top",
   end: "bottom bottom",
   pin: "#ritual-image",
   pinSpacing: false
   })
   
/* 
Light 
*/
   const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
   directionalLight.position.set(1, 3, 2)
   scene.add(directionalLight)

   const ambientLight = new THREE.AmbientLight(0xffffff, 4)
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
      
      //controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(animationFlow)
   }
   animationFlow()