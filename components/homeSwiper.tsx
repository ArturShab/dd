"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

export default function HomeSwiper() {
  return (
    <div className="relative">
      <div className="absolute h-full w-full flex justify-between items-center z-10 px-15">
        <button className="prevbut bg-black opacity-50 rounded-full cursor-pointer w-10 h-10">
          <svg
            width="40"
            height="38"
            viewBox="0 0 40 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.3333 19H6.66667M18.3333 30.0833L6.66667 19L18.3333 7.91666"
              stroke="white"
              strokeWidth="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button className="nextbut rotate-180 bg-black opacity-50 rounded-full cursor-pointer w-10 h-10">
          <svg
            width="40"
            height="38"
            viewBox="0 0 40 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.3333 19H6.66667M18.3333 30.0833L6.66667 19L18.3333 7.91666"
              stroke="white"
              strokeWidth="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <Swiper
        className="h-[60vh]"
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        allowTouchMove={false}
        autoplay={{ delay: 500 }}
        loop={true}
        navigation={{
          prevEl: ".prevbut",
          nextEl: ".nextbut",
        }}
      >
        <SwiperSlide className="bg-radial-[at_66%_50%] from-white from-10% to-violet-200 to-90%"></SwiperSlide>
        <SwiperSlide className="bg-radial-[at_66%_50%] from-white from-10% to-sky-200 to-90%"></SwiperSlide>
        <SwiperSlide className=" bg-red-100"></SwiperSlide>
        <SwiperSlide className="bg-radial-[at_66%_50%] from-white from-10% to-green-200 to-90%"></SwiperSlide>
      </Swiper>
    </div>
  );
}
