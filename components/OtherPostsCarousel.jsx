"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const OtherPostsCarousel = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        "https://fegoesim.com/wp-json/wp/v2/posts?per_page=20&_embed"
      );
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-[4vmin] font-bold my-8">您可能有興趣的文章</h2>
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        speed={900} // 平滑過渡
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 4 },
        }}
        modules={[Autoplay, Navigation]}
      >
        {posts.map((post) => {
          const imageMatch = post.content.rendered.match(
            /<img[^>]+src="([^">]+)"/
          );
          const previewImg = imageMatch?.[1]?.replace(
            "https://dyx.wxv.mybluehost.me/website_a8bfc44c",
            "https://www.wmesim.com"
          );

          return (
            <SwiperSlide key={post.id}>
              <a href={`/blog/${post.slug}`} className="block group">
                {previewImg && (
                  <div className="relative w-full pb-[75%] mb-2 overflow-hidden rounded-lg">
                    <img
                      src={previewImg}
                      alt={post.title.rendered}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="text-base text-black hover:text-[#4060fe] font-medium group-hover:underline">
                  {post.title.rendered}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString("zh-TW")}
                </p>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default OtherPostsCarousel;
