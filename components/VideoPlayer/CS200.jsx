// components/VideoPlayer.jsx

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = ''; // Path to your local video file
  const posterUrl = 'https://www.ultraehp.com/images/Ultra Video/CS200/中文版/YouTube-CS200-中文.webp'; // Path to your video poster image

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="player-wrapper mt-[15px] md:mt-[40px] w-full md:px-0 border-5 border-[#01a5d3] mx-auto rounded-2xl overflow-hidden relative">
      {/* Display poster image or play button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={handlePlayClick}>
          <img src={posterUrl} alt="Video Poster" className="w-full h-full object-cover" />
          <button className="absolute text-white text-3xl font-bold">▶</button>
        </div>
      )}

      {/* Conditionally load react-player */}
      {isPlaying && (
        <DynamicReactPlayer
          url={videoUrl}
          className="react-player rounded-2xl"
          width="100%"
          height="100%"
          controls
          playing // Auto-play video when it's loaded
          config={{
            file: {
              attributes: {
                poster: posterUrl, // Specify the poster image
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
