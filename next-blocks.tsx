"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons"

const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const BoxWithEdges = ({ position }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial 
          color="#0070f3"
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color="#214dbd" linewidth={2} />
      </lineSegments>
    </group>
  )
}

const BoxLetter = ({ letter, position, scaleFactor }) => {
  const group = useRef()

  const getLetterShape = (letter) => {
    const shapes = {
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
      E: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    }
    return shapes[letter] || shapes['N'] // Default to 'N' if letter is not found
  }

  const letterShape = getLetterShape(letter)

  return (
    <group ref={group} position={position} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      {letterShape.map((row, i) =>
        row.map((cell, j) => {
          if (cell) {
            let xOffset = j * 0.5 - (letter === 'T' ? 1 : letter === 'E' ? 0.5 : letter === 'X' || letter === 'N' ? 1 : 0.75)
            
            if (letter === 'N') {
              if (j === 0) {
                xOffset = -0.5;
              } else if (j === 1) {
                xOffset = 0;
              } else if (j === 2) {
                xOffset = 0.25;
              } else if (j === 3) {
                xOffset = 0.5;
              } else if (j === 4) {
                xOffset = 1;
              }
            }
            
            if (letter === 'X') {
              if (j === 0) {
                xOffset = -1;
              } else if (j === 1) {
                xOffset = -0.75;
              } else if (j === 2) {
                xOffset = -0.25;
              } else if (j === 3) {
                xOffset = 0.25;
              } else if (j === 4) {
                xOffset = 0.5;
              }
            }
            
            return (
              <BoxWithEdges 
                key={`${i}-${j}`} 
                position={[xOffset, (4 - i) * 0.5 - 1, 0]}
              />
            )
          }
          return null
        })
      )}
    </group>
  )
}

const Scene = () => {
  const orbitControlsRef = useRef()
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  const scaleFactor = isMobileDevice ? 0.5 : 1 // 设备为移动端时缩小为 0.5，其他设备保持为 1

  // 根据缩放因子动态调整字母之间的间距
  const positionOffsets = isMobileDevice ? 1.5 : 2.5; // 适当减小手机端字母之间的间距

  return (
    <>
      <group position={[-0.5, 0, 0]} rotation={[0, Math.PI / 1.5, 0]}>
        <BoxLetter letter="N" position={[-positionOffsets * 2, 0, 0]} scaleFactor={scaleFactor} />
        <BoxLetter letter="E" position={[-positionOffsets, 0, 0]} scaleFactor={scaleFactor} />
        <BoxLetter letter="X" position={[positionOffsets, 0, 0]} scaleFactor={scaleFactor} />
        <BoxLetter letter="T" position={[positionOffsets * 2, 0, 0]} scaleFactor={scaleFactor} />
      </group>
      <OrbitControls 
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={2}
        rotation={[Math.PI, 0, 0]}
      />
      
      <ambientLight intensity={0.5} />
      
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      
      <Environment 
        files={isMobileDevice 
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  )
}

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-900 relative">
      {/* 右上角社交媒体图标 */}
      <div className="absolute top-4 right-4 flex space-x-4 z-50">
        <a 
          href="https://github.com/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 text-2xl"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a 
          href="https://t.me/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 text-2xl"
        >
          <FontAwesomeIcon icon={faTelegram} />
        </a>
        <a 
          href="https://twitter.com/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 text-2xl"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>

      {/* 添加图片 */}
      <div className="absolute top-[calc(50%-300px)] left-1/2 transform -translate-x-1/2 z-10">
        <img src="/AI.png" alt="Your Image" className="w-24 h-auto"/>
      </div>

      <Canvas camera={{ position: [10.047021, -0.127436, -11.137374], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
