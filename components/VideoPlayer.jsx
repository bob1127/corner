
import { Video, CloudinaryContext } from "cloudinary-react";
import { useState, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";

const MemoVidPlayer = memo(({ publicId }) => {
    return (
        <CloudinaryContext cloudName="chuloo">
            <Video publicId={publicId} width="600px" controls />
        </CloudinaryContext>
    );
});
export const VideoPlayer = ({ vidPublicId = "drmonozsf/" }) => {
      const [publicId, setPublicId] = useState("");
      const { ref, inView } = useInView({ threshold: 1 });
      useEffect(() => {
        if (inView === true) {
          setPublicId(vidPublicId);
        }
      }, [inView, vidPublicId]);


      return (
        <div ref={ref}>
          <MemoVidPlayer publicId={publicId} />
        </div>
      );
    };
