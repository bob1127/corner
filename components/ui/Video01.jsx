
'use client'

import { useState, useEffect } from 'react'


export function Video() {
    return (
        <video width="320" height="240" controls preload="none">
            <source src="@/public/videos/吹氣袋-吸管插入拷貝.mp4" type="video/mp4" />
            {/* <track
                src="/path/to/captions.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
            /> */}
           
        </video>
    )
}