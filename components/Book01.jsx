import React, { useMemo, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const BOOK_W = 550; // 單頁寬
const BOOK_H = 900; // 單頁高

// 單頁（固定寬高、無內距）
const BookPage = React.forwardRef(function BookPage(
  { children, className = "" },
  ref
) {
  return (
    <div ref={ref} className={`page ${className}`}>
      <div className="page-content">{children}</div>
      <style jsx>{`
        .page {
          width: ${BOOK_W}px;
          height: ${BOOK_H}px;
          background: #fff;
          overflow: hidden;
        }
        .page-content {
          width: 100%;
          height: 100%;
          padding: 0;
          display: block;
          backface-visibility: hidden;
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
});

function Book() {
  // 產出 /images/有香菜單01.png ~ 10.png
  const menuImages = useMemo(
    () =>
      Array.from(
        { length: 10 },
        (_, i) => `/images/有香菜單${String(i + 1).padStart(2, "0")}.png`
      ),
    []
  );

  // 預載圖片，翻頁更順
  useEffect(() => {
    menuImages.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [menuImages]);

  return (
    <div className="book-wrap">
      <HTMLFlipBook
        className="flipbook"
        width={BOOK_W}
        height={BOOK_H}
        size="fixed"
        showCover
        usePortrait // 窄螢幕自動單頁；想固定雙頁可移除或設 false
        drawShadow
        maxShadowOpacity={0.3}
        animationDuration={600}
        mobileScrollSupport
        clickEventHandler="default"
      >
        {/* 逐頁渲染：第一張為封面（因 showCover） */}
        {menuImages.map((src, i) => (
          <BookPage key={src} className={i === 0 ? "cover" : ""}>
            <img
              src={src}
              alt={`有香菜單 ${String(i + 1).padStart(2, "0")}`}
              className="full-contain"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          </BookPage>
        ))}
      </HTMLFlipBook>

      <style jsx>{`
        .book-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: #f7f7f8;
          /* 以雙頁寬做基準，32px 是左右 padding 預留 */
          --book-scale: clamp(0.9, calc((100vw - 32px) / ${BOOK_W * 2}), 1);
        }

        /* 完整呈現圖片（不裁切），高度優先塞滿頁面 */
        .full-contain {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain; /* ✅ 重點：不裁切、完整顯示 */
          object-position: center;
          background: #fff; /* 留白區域為白色，可自行調整 */
          user-select: none;
          -webkit-user-drag: none;
          transform: translateZ(0);
        }

        .cover {
          background: #fff;
        }

        /* 小螢幕整本縮放（不改實際寬度，保留雙頁計算） */
        :global(.flipbook) {
          transform: scale(var(--book-scale));
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
}

export default Book;
