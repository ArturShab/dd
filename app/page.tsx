import HomeSwiper from "@/components/homeSwiper";
import ProductSwiper from "@/components/productSwiper";
import prisma from "@/lib/prisma";
import axios from "axios";

export default async function Home() {
  const categoriesData = await axios.get(
    "http://localhost:3000/api/categories",
  );
  const typesOfNovinki = await prisma.type.findMany({
    where: { categoryID: 25 },
  });
  const typesTolko = await prisma.type.findMany({
    where: { categoryID: 26 },
  });
  const typesRasp= await prisma.type.findMany({
    where: { categoryID: 27 },
  });
  const novinki: {
    id: number;
    name: string;
    price: number;
    description: string | null;
    quantity: number;
    typeID: number;
  }[] = [];
  const tolko: {
    id: number;
    name: string;
    price: number;
    description: string | null;
    quantity: number;
    typeID: number;
  }[] = [];
  const rasp: {
    id: number;
    name: string;
    price: number;
    description: string | null;
    quantity: number;
    typeID: number;
  }[] = [];
  typesOfNovinki.map(async (el) => {
    const resp = await prisma.product.findMany({ where: { typeID: el.id } });
    if (resp) {
      novinki.push(...resp);
    }
  });
  typesTolko.map(async (el) => {
    const resp = await prisma.product.findMany({ where: { typeID: el.id } });
    if (resp) {
      tolko.push(...resp);
    }
  });
  typesRasp.map(async (el) => {
    const resp = await prisma.product.findMany({ where: { typeID: el.id } });
    if (resp) {
      rasp.push(...resp);
    }
  });
  return (
    <main>
      <HomeSwiper></HomeSwiper>
      <div className="px-[15%] py-6 flex justify-between items-center font-semibold text-md">
        <div className="w-[15%] flex gap-2 items-center">
          <svg
            width="90"
            height="90"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 3.66669L22 10.5417L11 17.4167L0 10.5417L11 3.66669ZM33 3.66669L44 10.5417L33 17.4167L22 10.5417L33 3.66669ZM0 24.2917L11 17.4167L22 24.2917L11 31.1667L0 24.2917ZM33 17.4167L44 24.2917L33 31.1667L22 24.2917L33 17.4167ZM11 33.4584L22 26.5834L33 33.4584L22 40.3334L11 33.4584Z"
              fill="#028DFF"
            />
          </svg>
          <span>Бесплатная доставка по РФ</span>
        </div>
        <div className="w-[15%] flex gap-2 items-center">
          <svg
            width="90"
            height="90"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 14.1667C4 13.0616 4.43899 12.0018 5.22039 11.2204C6.00179 10.439 7.0616 10 8.16667 10H41.5C42.6051 10 43.6649 10.439 44.4463 11.2204C45.2277 12.0018 45.6667 13.0616 45.6667 14.1667V35C45.6667 36.1051 45.2277 37.1649 44.4463 37.9463C43.6649 38.7277 42.6051 39.1667 41.5 39.1667H8.16667C7.0616 39.1667 6.00179 38.7277 5.22039 37.9463C4.43899 37.1649 4 36.1051 4 35V14.1667Z"
              stroke="#028DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24.8333 30.8333C28.2851 30.8333 31.0833 28.0351 31.0833 24.5833C31.0833 21.1315 28.2851 18.3333 24.8333 18.3333C21.3815 18.3333 18.5833 21.1315 18.5833 24.5833C18.5833 28.0351 21.3815 30.8333 24.8333 30.8333Z"
              stroke="#028DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 18.3333C6.21014 18.3333 8.32975 17.4554 9.89256 15.8926C11.4554 14.3298 12.3333 12.2101 12.3333 10M37.3333 39.1667C37.3333 36.9565 38.2113 34.8369 39.7741 33.2741C41.3369 31.7113 43.4565 30.8333 45.6667 30.8333"
              stroke="#028DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Гарантия лучшей цены</span>
        </div>
        <div className="w-[15%] flex gap-2 items-center">
          <svg
            width="90"
            height="90"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.8153 5.71498C25.4836 5.34382 26.2355 5.14905 27 5.14905C27.7645 5.14905 28.5164 5.34382 29.1847 5.71498L46.0935 15.1065C46.4441 15.3014 46.7361 15.5865 46.9395 15.9323C47.1428 16.278 47.25 16.6719 47.25 17.073V35.6017C47.2502 36.4046 47.0356 37.1928 46.6285 37.8848C46.2214 38.5768 45.6366 39.1472 44.9348 39.537L29.1847 48.285C28.5164 48.6561 27.7645 48.8509 27 48.8509C26.2355 48.8509 25.4836 48.6561 24.8153 48.285L9.06525 39.5347C8.36405 39.1453 7.77967 38.5756 7.37261 37.8845C6.96554 37.1934 6.75059 36.4061 6.75 35.604V17.073C6.74998 16.6719 6.8572 16.278 7.06053 15.9323C7.26387 15.5865 7.55594 15.3014 7.9065 15.1065L24.8153 5.71498Z"
              stroke="#028DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.875 10.125L37.125 21.375V29.25M13.5 27.738L20.25 31.5"
              stroke="#028DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.75 15.75L27 27M27 27L47.25 15.75M27 27V49.5"
              stroke="#028DFF"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
          <span>Большой ассортимент</span>
        </div>
        <div className="w-[15%] flex gap-2 items-center">
          <svg
            width="90"
            height="90"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.772 48.1933L33.5295 45.5652C38.334 42.2029 42.0529 37.5115 44.2299 32.0664C46.4069 26.6212 46.9474 20.6591 45.7853 14.9113C45.7275 14.6282 45.6055 14.3622 45.4288 14.1336C45.2521 13.905 45.0254 13.72 44.766 13.5927L27.1913 5L9.61879 13.5927C9.359 13.7197 9.13182 13.9046 8.95472 14.1332C8.77763 14.3618 8.65535 14.628 8.59729 14.9113C7.43536 20.6594 7.97628 26.6216 10.1537 32.0667C12.3311 37.5119 16.0504 42.2032 20.8553 45.5652L24.6128 48.1933C25.369 48.7223 26.2695 49.006 27.1924 49.006C28.1153 49.006 29.0158 48.7223 29.772 48.1933Z"
              stroke="#028DFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Гарантия качества</span>
        </div>
      </div>
      <section className="px-[15%]">
        <div>
          <h2 className="text-2xl font-bold">Новинки</h2>
          <ProductSwiper id={1} products={novinki} categoryId={25} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Только у нас</h2>
          <ProductSwiper id={2} products={tolko} categoryId={26} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Распродажа</h2>
          <ProductSwiper id={3} products={rasp} categoryId={27} />  
        </div>
      </section>
    </main>
  );
}
