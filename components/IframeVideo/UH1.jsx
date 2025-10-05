import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const LazyYouTube = ({ videoId, thumbnail }) => {
    const [isInView, setIsInView] = useState(false);
    const iframeRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (iframeRef.current) {
            observer.observe(iframeRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={iframeRef}>
            {isInView ? (
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <Image
                    src={thumbnail}
                    alt="YouTube video thumbnail"
                    layout="responsive"
                    width={560}
                    height={315}
                />
            )}
        </div>
    );
};

export default LazyYouTube;
