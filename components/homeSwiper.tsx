"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

export default function HomeSwiper() {
  return (
    <div className="relative">
      <div className=" pointer-events-none absolute h-full w-full flex justify-between items-center z-10 px-15">
        <button className=" pointer-events-auto prevbut bg-black opacity-50 rounded-full cursor-pointer w-10 h-10">
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
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className=" pointer-events-auto  nextbut rotate-180 bg-black opacity-50 rounded-full cursor-pointer w-10 h-10">
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
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        allowTouchMove={false}
        autoplay={{ delay: 5000 }}
        loop={true}
        preventClicks={false}
        preventClicksPropagation={false}
        navigation={{
          prevEl: ".prevbut",
          nextEl: ".nextbut",
        }}
      >
        <SwiperSlide className=" px-[15%] py-[7%] bg-radial-[at_66%_50%] from-white from-10% to-violet-200 to-90%">
          <div className="h-full flex items-center justify-between">
            <div className=" w-[25%]">
              <h1 className=" font-bold text-4xl">Аппараты УЗИ от SonoPulse</h1>
              <div className=" border-l-4 pl-8 my-8 text-xl">
                <h2>Медицинское оборудование</h2>
                <h2>Высокое качество</h2>
                <h2>Лучшие цены</h2>
              </div>
              <button className="bg-blue-500 text-white font-bold cursor-pointer px-8 py-4 rounded hover:bg-blue-600">
                Подробнее
              </button>
            </div>
            <div>
              <Image
                width={500}
                height={500}
                alt="UZI Apparatus"
                src="/uzi.png"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className=" flex justify-between px-[15%] py-[7%] bg-radial-[at_66%_50%] from-white from-10% to-sky-200 to-90%">
          <div className="h-full flex items-center justify-between">
            <div className=" w-[25%]">
              <h1 className=" font-bold text-4xl">Аппараты УЗИ от SonoPulse</h1>
              <div className=" border-l-4 pl-8 my-8 text-xl">
                <h2>Медицинское оборудование</h2>
                <h2>Высокое качество</h2>
                <h2>Лучшие цены</h2>
              </div>
              <button className="bg-blue-500 text-white font-bold cursor-pointer px-8 py-4 rounded hover:bg-blue-600">
                Подробнее
              </button>
            </div>
            <div>
              <Image
                width={500}
                height={500}
                alt="UZI Apparatus"
                src="/uzi.png"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className=" flex justify-between px-[15%] py-[7%]  bg-red-100">
          <div className="h-full flex items-center justify-between">
            <div className=" w-[25%]">
              <h1 className=" font-bold text-4xl">Аппараты УЗИ от SonoPulse</h1>
              <div className=" border-l-4 pl-8 my-8 text-xl">
                <h2>Медицинское оборудование</h2>
                <h2>Высокое качество</h2>
                <h2>Лучшие цены</h2>
              </div>
              <button className="bg-blue-500 text-white font-bold cursor-pointer px-8 py-4 rounded hover:bg-blue-600">
                Подробнее
              </button>
            </div>
            <div>
              <Image
                width={500}
                height={500}
                alt="UZI Apparatus"
                src="/uzi.png"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className=" flex justify-between px-[15%] py-[7%] bg-radial-[at_66%_50%] from-white from-10% to-green-200 to-90%">
          <div className="h-full flex items-center justify-between">
            <div className=" w-[25%]">
              <h1 className=" font-bold text-4xl">Аппараты УЗИ от SonoPulse</h1>
              <div className=" border-l-4 pl-8 my-8 text-xl">
                <h2>Медицинское оборудование</h2>
                <h2>Высокое качество</h2>
                <h2>Лучшие цены</h2>
              </div>
              <button className="bg-blue-500 text-white font-bold cursor-pointer px-8 py-4 rounded hover:bg-blue-600">
                Подробнее
              </button>
            </div>
            <div>
              <Image
                width={500}
                height={500}
                alt="UZI Apparatus"
                src="/uzi.png"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
