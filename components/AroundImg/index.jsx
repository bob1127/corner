import { motion, AnimatePresence, useCycle } from 'framer-motion';
import { useEffect } from 'react';

const ImageWithMarqueeText = () => {
  const [texts, cycleTexts] = useCycle(
    "Text at top left",
    "Text at top right",
    "Text at bottom right",
    "Text at bottom left"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      cycleTexts();
    }, 3000); // 切換文字的間隔時間，這裡設置為3秒

    return () => clearInterval(interval);
  }, [cycleTexts]);

  return (
    <div className="top w-full flex flex-row">
      <div className="relative w-1/2 border-1 border-black">
        <motion.img 
          src="https://www.nikoand.jp/wp-content/uploads/2024/07/mu_thumbnail.jpg" 
          className="w-[300px] h-[300px]" 
          alt=""
        />
        <AnimatePresence initial={false}>
          <motion.div 
            key={texts}
            className="absolute p-2 text-white bg-black bg-opacity-50"
            initial={{ x: '-100%', y: '-100%' }}
            animate={{ x: '0%', y: '0%' }}
            exit={{ x: '100%', y: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            {texts}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative w-1/2">
        <motion.img 
          src="https://www.nikoand.jp/wp-content/uploads/2024/07/MAIN_VISUAL-1024x1024.jpg" 
          className="w-[300px] h-[300px]" 
          alt=""
        />
      </div>
    </div>
  );
};

export default ImageWithMarqueeText;
