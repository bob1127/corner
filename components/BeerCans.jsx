// components/BeerCans.jsx
"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF, ContactShadows } from "@react-three/drei";

export default function BeerCans({
  items = [
    { title: "Lager", subtitle: "乾淨俐落", bg: "#0f172a" },
    { title: "IPA", subtitle: "熱帶果香", bg: "#1e293b" },
    { title: "Stout", subtitle: "濃厚麥香", bg: "#111827" },
    { title: "Wheat", subtitle: "清爽小麥", bg: "#0b1220" },
  ],
  modelPath = "/model/can.glb",
  height = 460,
}) {
  return (
    <section className="w-full">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item, idx) => (
          <CanCard
            key={idx}
            title={item.title}
            subtitle={item.subtitle}
            bg={item.bg}
            modelPath={modelPath}
            height={height}
          />
        ))}
      </div>
    </section>
  );
}

function CanCard({ title, subtitle, bg, modelPath, height }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg transition-[transform,box-shadow] duration-300 hover:shadow-2xl"
      style={{ backgroundColor: bg || "#0f172a", height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 標題／副標題（hover 才顯示） */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-[90%] -translate-x-1/2 text-center">
        <div
          className={`transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-semibold leading-none tracking-wide text-white md:text-2xl">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/80 md:text-base">{subtitle}</p>
        </div>
      </div>

      {/* 3D 場景 */}
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 40 }} // ← 拉遠 + 稍窄視角，避免超框
          onCreated={(state) => {
            state.gl.setClearColor(0x000000, 0);
            state.gl.toneMappingExposure = 1.08;
          }}
        >
          {/* 柔和打光（無 HDR） */}
          <hemisphereLight intensity={0.55} />
          <spotLight
            position={[3, 4, 5]}
            angle={0.7}
            penumbra={0.7}
            intensity={1.1}
            castShadow
          />
          <directionalLight position={[-4, 1.5, 3]} intensity={0.5} />
          <directionalLight position={[0, 2.5, -4]} intensity={0.55} />
          <pointLight position={[0, 1.2, 2.2]} intensity={0.42} />

          <Suspense fallback={null}>
            {/* 不用 top，確實置中 */}
            <Center>
              <SpinningCan modelPath={modelPath} hovered={hovered} />
            </Center>

            {/* 柔和接觸陰影 */}
            <ContactShadows
              position={[0, -0.7, 0]}
              opacity={0.32}
              scale={5.5}
              blur={2.6}
              far={8}
              resolution={1024}
              frames={1}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}

/* 只在 hover 左右擺動（繞 Y 軸）；縮小並擺正 */
function SpinningCan({ modelPath, hovered }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  useFrame((state) => {
    if (!group.current) return;
    if (hovered) {
      const t = state.clock.getElapsedTime();
      const max = 0.35; // 左右最大角度（弧度）
      const freq = 1.8; // 擺動頻率
      group.current.rotation.y = Math.sin(t * freq) * max;
    } else {
      // 離開時回正
      group.current.rotation.y *= 0.9;
      if (Math.abs(group.current.rotation.y) < 0.001)
        group.current.rotation.y = 0;
    }
  });

  return (
    <group
      ref={group}
      rotation={[0, 0, 0]} // 擺正
      position={[0, -0.2, 0]} // 微下移，避免頂到上緣
      scale={0.6} // ← 主要縮放，已大幅縮小
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/model/can.glb");
