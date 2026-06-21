-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_typeID_fkey";

-- DropForeignKey
ALTER TABLE "Spec" DROP CONSTRAINT "Spec_typeID_fkey";

-- DropForeignKey
ALTER TABLE "SpecValue" DROP CONSTRAINT "SpecValue_productID_fkey";

-- DropForeignKey
ALTER TABLE "SpecValue" DROP CONSTRAINT "SpecValue_specID_fkey";

-- DropForeignKey
ALTER TABLE "Type" DROP CONSTRAINT "Type_categoryID_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Type" ADD CONSTRAINT "Type_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spec" ADD CONSTRAINT "Spec_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecValue" ADD CONSTRAINT "SpecValue_specID_fkey" FOREIGN KEY ("specID") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecValue" ADD CONSTRAINT "SpecValue_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
