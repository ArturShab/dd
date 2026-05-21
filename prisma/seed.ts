import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete existing data to ensure fresh seed
    await prisma.specValue.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.spec.deleteMany({});
    await prisma.type.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('Cleaned up existing data');

    // Create category
    const category = await prisma.category.create({
      data: {
        name: 'Гинекология и акушерство',
      },
    });
    console.log('Created category:', category);

    // Create type
    const type = await prisma.type.create({
      data: {
        name: 'колькоскопы',
        categoryID: category.id,
      },
    });
    console.log('Created type:', type);

    // Create specs
    const specNames = [
      'Тип',
      'Увеличение',
      'Разрешение',
      'Источник света',
      'Освещенность',
      'Рабочее расстояние',
      'Видеокамера',
      'Стойка',
    ];

    const specs = await Promise.all(
      specNames.map((name) =>
        prisma.spec.create({
          data: {
            name,
            typeID: type.id,
          },
        }),
      ),
    );
    console.log('Created specs:', specs);

    // Create product
    const product = await prisma.product.create({
      data: {
        name: 'Видеокольпоскоп цифровой Kernel KN-2200',
        typeID: type.id,
      },
    });
    console.log('Created product:', product);

    // Create spec values for the product
    const specValues = [
      { specName: 'Тип', value: 'цифровой' },
      { specName: 'Увеличение', value: '18х (на расстоянии 200–300 мм)' },
      { specName: 'Разрешение', value: 'горизонтальное ≥600TVL, всп. дисплей 320x240 пикселей' },
      { specName: 'Источник света', value: 'светодиоды' },
      { specName: 'Освещенность', value: '1200 лк' },
      { specName: 'Рабочее расстояние', value: '200–400 мм' },
      { specName: 'Видеокамера', value: 'Sony Super HAD color digital CCD' },
      { specName: 'Стойка', value: 'прямая, телескопическая, передвижная' },
    ];

    const createdSpecValues = await Promise.all(
      specValues.map(({ specName, value }) => {
        const spec = specs.find((s) => s.name === specName);
        if (!spec) {
          throw new Error(`Spec "${specName}" not found`);
        }
        return prisma.specValue.create({
          data: {
            specID: spec.id,
            productID: product.id,
          },
        });
      }),
    );
    console.log('Created spec values:', createdSpecValues);

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
