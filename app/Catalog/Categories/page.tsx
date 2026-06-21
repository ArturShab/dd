import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"


export default async function Categories(){
    const data = await prisma.category.findMany({
        include: { types: { include: { products: true } } }
    })

    return(
        <main className="px-[15%] py-6">
            <div className="grid grid-cols-5 gap-6 auto-rows-[30vh]">
                {data.map((el) => {
                    const productCount = el.types?.reduce((s: number, t: any) => s + (t.products?.length ?? 0), 0) ?? 0
                    return (
                        <Link href={`./${el.id}`} key={el.id} className="bg-white rounded-md shadow-md p-4 flex flex-col">
                            <div className="flex-1 flex items-center justify-center">
                                <Image src="/uzi copy.png" alt={el.name} width={140} height={140} className="object-contain" />
                            </div>
                            <h3 className="mt-3 text-lg font-medium text-gray-800">{el.name}</h3>
                            <p className="text-sm text-gray-500">{productCount} наименований</p>
                        </Link>
                    )
                })}
            </div>
        </main>
    )
}