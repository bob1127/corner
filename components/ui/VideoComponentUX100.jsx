import { getVideoSrc } from '../../public/videos/吹氣袋-吸管插入拷貝.mp4' 


export default async function VideoComponent() {
    const src = await getVideoSrc()

    return <iframe src={src} frameborder="0" allowfullscreen />
}