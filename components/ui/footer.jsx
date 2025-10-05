import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      {/* 上半：米色底，左LOGO／中導覽／右社群 */}
      <div className="bg-[#ead6c0]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
            {/* 左：Logo */}
            <div className="flex sm:justify-start justify-center">
              <Image
                src="/images/logo05.png"
                alt="Memory Corner / 有香餐飲集團"
                width={180}
                height={80}
                className="h-auto w-[100px]"
                priority={false}
              />
            </div>

            {/* 中：導覽連結 */}
            <nav className="flex items-center justify-center text-sm">
              <ul className="flex items-center gap-8 text-[#5b4630]">
                <li>
                  <Link
                    href="/about"
                    className="hover:underline underline-offset-4"
                  >
                    <p>品牌故事</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:underline underline-offset-4"
                  >
                    <p>聯絡我們</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:underline underline-offset-4"
                  >
                    <p>隱私政策說明</p>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* 右：社群 icon */}
            <div className="flex sm:justify-end justify-center">
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <Link
                  href="https://www.facebook.com/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <svg
                    viewBox="0 0 50 50"
                    className="h-7 w-7 fill-[#5b4630] opacity-80 transition group-hover:opacity-100"
                  >
                    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
                  </svg>
                </Link>
                {/* Instagram */}
                <Link
                  href="https://www.instagram.com/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <svg
                    viewBox="0 0 50 50"
                    className="h-7 w-7 fill-[#5b4630] opacity-80 transition group-hover:opacity-100"
                  >
                    <path d="M16 3C8.83 3 3 8.83 3 16v18c0 7.17 5.83 13 13 13h18c7.17 0 13-5.83 13-13V16C47 8.83 41.17 3 34 3H16zm21 8a2 2 0 110 4 2 2 0 010-4zM25 14c6.07 0 11 4.93 11 11s-4.93 11-11 11-11-4.93-11-11 4.93-11 11-11zm0 2a9 9 0 100 18 9 9 0 000-18z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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
