import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      {/* 下半：整條棕色版權列 */}
      <div className="bg-[#b5864f]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="py-3 text-center text-[13px] tracking-wide text-white/95">
            Memory Corner co. ltd. all © {year} Copyright
          </div>
        </div>
      </div>
    </footer>
  );
}
