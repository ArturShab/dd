"use client";

import prisma from "@/lib/prisma";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

type SwiperProps = {
  products: {
    id: number;
    name: string;
    price: number;
    description: string | null;
    quantity: number;
    typeID: number;
  }[],
  id: number,
  categoryId?: number
};
export default function ProductSwiper(props: SwiperProps) {
  return (
    <div className="my-2">
      <div className=" flex gap-2 items-center">
        <button className={`prevbut${props.id} text-xl`}>←</button>
        <Swiper
          className=""
          modules={[Navigation]}
          slidesPerView={5}
          spaceBetween={10}
          allowTouchMove={false}
          loop={true}
          preventClicksPropagation={false}
          navigation={{
            prevEl: `.prevbut${props.id}`,
            nextEl: `.nextbut${props.id}`,
          }}
        >
          {props.products.map((el) => {
            const href = `/product/${el.id}`;
            return (
              <SwiperSlide className="py-3 px-1" key={el.id}>
                <Link href={String(href)} className="block">
                  <div className=" shadow-md shadow-black/27 flex flex-col h-fit  p-3 hover:shadow-lg">
                    {(el.quantity > 0 && (
                      <p className=" font-bold text-sm text-green-600">Есть в наличии</p>
                    )) || (
                      <p className=" font-bold text-sm text-amber-600">Ожидает поставки</p>
                    )}
                    <img src="/uzi copy.png" alt="Product Image" />
                    <p className="text-sm truncate">{el.name}</p>
                    <p className="mt-3 text-md font-bold">{el.price} руб.</p>
                    <button className="py-0.5 bg-green-600 text-white my-3">В корзину</button>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className={`nextbut${props.id} text-xl`}>→</button>
      </div>
    </div>
  );
}
