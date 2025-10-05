export default async function VideoComponent01() {

     
     const src = await getVideoSrc('')

     return <iframe src={src} frameborder="0" allowfullscreen />
}