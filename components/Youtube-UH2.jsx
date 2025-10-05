// 引入必要的套件
import React from 'react';
import YouTube from 'react-youtube';

// 在你的React組件中使用YouTube組件
const MyYouTubeComponent = () => {
    // 定義影片的ID
    const videoId = '9rpF9iOZSi0';

    // 當播放器準備好時的回調函數
    const onReady = (event) => {
        // 可以在這裡添加播放器準備好時的邏輯
        console.log('播放器已準備就緒');
    };

    // 影片播放狀態改變時的回調函數
    const onStateChange = (event) => {
        // 可以在這裡添加影片狀態改變時的邏輯
    };

    return (
        <div className="border-5 border-[#01a5d3] rounded-xl overflow-hidden">
            <YouTube
                videoId={videoId}
                opts={{ height: '390', width: '640' }}
                onReady={onReady}
                onStateChange={onStateChange}
            />
        </div>
    );
};

export default MyYouTubeComponent;
