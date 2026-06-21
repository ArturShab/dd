import fetch from "node-fetch";

// ============================================
// КОНФИГУРАЦИЯ
// ============================================
const API_BASE_URL = 'http://localhost:3000/api';

// ============================================
// ДАННЫЕ
// ============================================

// Категории
const categories = ['Стоматология', 'Хирургия', 'Кардиология', 'Ортопедия'];

// Типы (связь с категориями по имени)
const typesData = [
  { name: 'Стоматологическое кресло', categoryName: 'Стоматология' },
  { name: 'Стоматологический инструмент', categoryName: 'Стоматология' },
  { name: 'Хирургический инструмент', categoryName: 'Хирургия' },
  { name: 'Хирургическое оборудование', categoryName: 'Хирургия' },
  { name: 'Кардиомонитор', categoryName: 'Кардиология' },
  { name: 'Электрокардиограф', categoryName: 'Кардиология' },
  { name: 'Ортопедический имплант', categoryName: 'Ортопедия' },
  { name: 'Ортопедический бандаж', categoryName: 'Ортопедия' },
];

// Спецификации (связь с типами по имени)
const specsData = [
  // Стоматологическое кресло
  { name: 'Максимальная нагрузка', typeName: 'Стоматологическое кресло' },
  { name: 'Регулировка высоты', typeName: 'Стоматологическое кресло' },
  { name: 'Материал обивки', typeName: 'Стоматологическое кресло' },
  { name: 'Наличие подголовника', typeName: 'Стоматологическое кресло' },
  // Стоматологический инструмент
  { name: 'Материал', typeName: 'Стоматологический инструмент' },
  { name: 'Тип инструмента', typeName: 'Стоматологический инструмент' },
  { name: 'Стерилизация', typeName: 'Стоматологический инструмент' },
  { name: 'Длина', typeName: 'Стоматологический инструмент' },
  // Хирургический инструмент
  { name: 'Материал', typeName: 'Хирургический инструмент' },
  { name: 'Тип', typeName: 'Хирургический инструмент' },
  { name: 'Размер', typeName: 'Хирургический инструмент' },
  { name: 'Стерилизация', typeName: 'Хирургический инструмент' },
  // Хирургическое оборудование
  { name: 'Мощность', typeName: 'Хирургическое оборудование' },
  { name: 'Тип', typeName: 'Хирургическое оборудование' },
  { name: 'Напряжение', typeName: 'Хирургическое оборудование' },
  { name: 'Вес', typeName: 'Хирургическое оборудование' },
  // Кардиомонитор
  { name: 'Диагональ экрана', typeName: 'Кардиомонитор' },
  { name: 'Количество отведений', typeName: 'Кардиомонитор' },
  { name: 'Пульсоксиметрия', typeName: 'Кардиомонитор' },
  { name: 'Масса', typeName: 'Кардиомонитор' },
  // Электрокардиограф
  { name: 'Количество каналов', typeName: 'Электрокардиограф' },
  { name: 'Скорость бумаги', typeName: 'Электрокардиограф' },
  { name: 'Вес', typeName: 'Электрокардиограф' },
  { name: 'Автоинтерпретация', typeName: 'Электрокардиограф' },
  // Ортопедический имплант
  { name: 'Материал', typeName: 'Ортопедический имплант' },
  { name: 'Размер', typeName: 'Ортопедический имплант' },
  { name: 'Тип фиксации', typeName: 'Ортопедический имплант' },
  { name: 'Срок службы', typeName: 'Ортопедический имплант' },
  // Ортопедический бандаж
  { name: 'Материал', typeName: 'Ортопедический бандаж' },
  { name: 'Размер', typeName: 'Ортопедический бандаж' },
  { name: 'Тип', typeName: 'Ортопедический бандаж' },
  { name: 'Степень фиксации', typeName: 'Ортопедический бандаж' },
];

// Товары (связь с типами по имени)
const productsData = [
  // Стоматологическое кресло
  { name: 'Sirona C8+', price: 150000, description: 'Многофункциональное стоматологическое кресло премиум-класса', quantity: 5, typeName: 'Стоматологическое кресло' },
  { name: 'KaVo ESTETICA E80', price: 120000, description: 'Стоматологическое кресло с электроприводом', quantity: 3, typeName: 'Стоматологическое кресло' },
  { name: 'A-dec 500', price: 180000, description: 'Профессиональное кресло для стоматологии', quantity: 2, typeName: 'Стоматологическое кресло' },
  { name: 'Planmeca Sovereign Classic', price: 135000, description: 'Надежное кресло с широкими возможностями регулировки', quantity: 4, typeName: 'Стоматологическое кресло' },
  { name: 'Dentsply Sirona Sinius', price: 200000, description: 'Кресло с интегрированной системой управления', quantity: 1, typeName: 'Стоматологическое кресло' },
  // Стоматологический инструмент
  { name: 'Скалер пьезоэлектрический EMS', price: 45000, description: 'Профессиональный ультразвуковой скалер', quantity: 10, typeName: 'Стоматологический инструмент' },
  { name: 'Микромотор NSK Surgic Pro', price: 58000, description: 'Хирургический микромотор для имплантации', quantity: 6, typeName: 'Стоматологический инструмент' },
  { name: 'Стоматологический светильник Woodpecker', price: 12000, description: 'Светодиодный светильник для полимеризации', quantity: 15, typeName: 'Стоматологический инструмент' },
  { name: 'Стоматологический пинцет', price: 2500, description: 'Титановый пинцет для манипуляций', quantity: 50, typeName: 'Стоматологический инструмент' },
  { name: 'Комплект стоматологических зеркал', price: 1800, description: 'Набор зеркал разного диаметра с подсветкой', quantity: 30, typeName: 'Стоматологический инструмент' },
  // Хирургический инструмент
  { name: 'Хирургический скальпель №10', price: 800, description: 'Одноразовый скальпель со съемным лезвием', quantity: 200, typeName: 'Хирургический инструмент' },
  { name: 'Зажим Кохера', price: 1500, description: 'Хирургический зажим для удержания тканей', quantity: 40, typeName: 'Хирургический инструмент' },
  { name: 'Ножницы хирургические', price: 3200, description: 'Изогнутые ножницы для рассечения тканей', quantity: 25, typeName: 'Хирургический инструмент' },
  { name: 'Иглодержатель Mathieu', price: 2800, description: 'Профессиональный иглодержатель для наложения швов', quantity: 35, typeName: 'Хирургический инструмент' },
  { name: 'Набор хирургических зондов', price: 2000, description: 'Набор зондов для диагностики тканей', quantity: 20, typeName: 'Хирургический инструмент' },
  // Хирургическое оборудование
  { name: 'Электронож Bovie', price: 85000, description: 'Высокочастотный электрохирургический аппарат', quantity: 3, typeName: 'Хирургическое оборудование' },
  { name: 'Отсасыватель хирургический Medela', price: 32000, description: 'Вакуумный отсасыватель для операционной', quantity: 5, typeName: 'Хирургическое оборудование' },
  { name: 'Осветительная система Aura', price: 110000, description: 'Мобильная хирургическая лампа бестеневая', quantity: 2, typeName: 'Хирургическое оборудование' },
  { name: 'Аспиратор хирургический', price: 28000, description: 'Хирургический аспиратор с комплектом канюль', quantity: 4, typeName: 'Хирургическое оборудование' },
  { name: 'Монитор пациента GE Healthcare', price: 145000, description: 'Многофункциональный монитор витальных функций', quantity: 2, typeName: 'Хирургическое оборудование' },
  // Кардиомонитор
  { name: 'Кардиомонитор Philips MX400', price: 320000, description: 'Профессиональный кардиомонитор с цветным дисплеем', quantity: 3, typeName: 'Кардиомонитор' },
  { name: 'Кардиомонитор Schiller MT-200', price: 280000, description: 'Монитор с функцией холтеровского мониторинга', quantity: 2, typeName: 'Кардиомонитор' },
  { name: 'Кардиомонитор Mindray PM-9000', price: 250000, description: 'Монитор пациента с расширенными возможностями', quantity: 4, typeName: 'Кардиомонитор' },
  { name: 'Кардиомонитор Fukuda Denshi', price: 300000, description: 'Монитор с высокой точностью измерений', quantity: 2, typeName: 'Кардиомонитор' },
  { name: 'Кардиомонитор Drager Vista 120', price: 270000, description: 'Современный монитор с защитой от помех', quantity: 3, typeName: 'Кардиомонитор' },
  // Электрокардиограф
  { name: 'ЭКГ-аппарат Schiller AT-101', price: 95000, description: 'Одноканальный портативный электрокардиограф', quantity: 8, typeName: 'Электрокардиограф' },
  { name: 'ЭКГ-аппарат Cardioline Touch', price: 120000, description: 'Трехканальный ЭКГ с сенсорным управлением', quantity: 5, typeName: 'Электрокардиограф' },
  { name: 'ЭКГ-аппарат Bionet CardioCare', price: 110000, description: 'Двенадцатиканальный электрокардиограф', quantity: 4, typeName: 'Электрокардиограф' },
  { name: 'ЭКГ-аппарат Contec TLC5000', price: 85000, description: 'ЭКГ с функцией длительной записи', quantity: 6, typeName: 'Электрокардиограф' },
  { name: 'ЭКГ-аппарат Edan SE-1201', price: 130000, description: 'Профессиональный ЭКГ с автоинтерпретацией', quantity: 3, typeName: 'Электрокардиограф' },
  // Ортопедический имплант
  { name: 'Имплант тазобедренного сустава', price: 180000, description: 'Цементный имплант с керамической головкой', quantity: 10, typeName: 'Ортопедический имплант' },
  { name: 'Имплант коленного сустава', price: 220000, description: 'Бикомпартментальный имплант для замены сустава', quantity: 8, typeName: 'Ортопедический имплант' },
  { name: 'Пластина для остеосинтеза', price: 25000, description: 'Титановая пластина для фиксации переломов', quantity: 25, typeName: 'Ортопедический имплант' },
  { name: 'Винт кортикальный', price: 3000, description: 'Титановый винт для остеосинтеза', quantity: 100, typeName: 'Ортопедический имплант' },
  { name: 'Имплант плечевого сустава', price: 165000, description: 'Обратный имплант для плечевого сустава', quantity: 6, typeName: 'Ортопедический имплант' },
  // Ортопедический бандаж
  { name: 'Бандаж на голеностоп', price: 5500, description: 'Эластичный бандаж с фиксацией голеностопа', quantity: 40, typeName: 'Ортопедический бандаж' },
  { name: 'Бандаж на коленный сустав', price: 6800, description: 'Ортопедический бандаж с боковыми ребрами', quantity: 35, typeName: 'Ортопедический бандаж' },
  { name: 'Бандаж на лучезапястный сустав', price: 4200, description: 'Бандаж с шиной для фиксации запястья', quantity: 45, typeName: 'Ортопедический бандаж' },
  { name: 'Бандаж на плечевой сустав', price: 7800, description: 'Фиксирующий бандаж для плеча с накладками', quantity: 25, typeName: 'Ортопедический бандаж' },
  { name: 'Бандаж поясничный', price: 8800, description: 'Поясничный корсет с усиленной поддержкой', quantity: 30, typeName: 'Ортопедический бандаж' },
];

// Значения свойств для товаров (связь с товарами и спецификациями по имени)
const productSpecsData = {
  'Sirona C8+': {
    typeName: 'Стоматологическое кресло',
    specs: [
      { specName: 'Максимальная нагрузка', value: '180 кг' },
      { specName: 'Регулировка высоты', value: 'Электрическая' },
      { specName: 'Материал обивки', value: 'Искусственная кожа' },
      { specName: 'Наличие подголовника', value: 'Да' },
    ]
  },
  'KaVo ESTETICA E80': {
    typeName: 'Стоматологическое кресло',
    specs: [
      { specName: 'Максимальная нагрузка', value: '180 кг' },
      { specName: 'Регулировка высоты', value: 'Электрическая' },
      { specName: 'Материал обивки', value: 'Искусственная кожа' },
      { specName: 'Наличие подголовника', value: 'Да' },
    ]
  },
  'A-dec 500': {
    typeName: 'Стоматологическое кресло',
    specs: [
      { specName: 'Максимальная нагрузка', value: '200 кг' },
      { specName: 'Регулировка высоты', value: 'Электрическая' },
      { specName: 'Материал обивки', value: 'Искусственная кожа' },
      { specName: 'Наличие подголовника', value: 'Да' },
    ]
  },
  'Planmeca Sovereign Classic': {
    typeName: 'Стоматологическое кресло',
    specs: [
      { specName: 'Максимальная нагрузка', value: '180 кг' },
      { specName: 'Регулировка высоты', value: 'Электрическая' },
      { specName: 'Материал обивки', value: 'Искусственная кожа' },
      { specName: 'Наличие подголовника', value: 'Да' },
    ]
  },
  'Dentsply Sirona Sinius': {
    typeName: 'Стоматологическое кресло',
    specs: [
      { specName: 'Максимальная нагрузка', value: '180 кг' },
      { specName: 'Регулировка высоты', value: 'Электрическая' },
      { specName: 'Материал обивки', value: 'Искусственная кожа' },
      { specName: 'Наличие подголовника', value: 'Да' },
    ]
  },
  'Скалер пьезоэлектрический EMS': {
    typeName: 'Стоматологический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип инструмента', value: 'Ультразвуковой' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
      { specName: 'Длина', value: '10-20 см' },
    ]
  },
  'Микромотор NSK Surgic Pro': {
    typeName: 'Стоматологический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип инструмента', value: 'Хирургический' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
      { specName: 'Длина', value: '10-20 см' },
    ]
  },
  'Стоматологический светильник Woodpecker': {
    typeName: 'Стоматологический инструмент',
    specs: [
      { specName: 'Материал', value: 'Алюминий' },
      { specName: 'Тип инструмента', value: 'Светодиодный' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
      { specName: 'Длина', value: '15 см' },
    ]
  },
  'Стоматологический пинцет': {
    typeName: 'Стоматологический инструмент',
    specs: [
      { specName: 'Материал', value: 'Титан' },
      { specName: 'Тип инструмента', value: 'Пинцет' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
      { specName: 'Длина', value: '15 см' },
    ]
  },
  'Комплект стоматологических зеркал': {
    typeName: 'Стоматологический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип инструмента', value: 'Зеркало' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
      { specName: 'Длина', value: '18-25 см' },
    ]
  },
  'Хирургический скальпель №10': {
    typeName: 'Хирургический инструмент',
    specs: [
      { specName: 'Материал', value: 'Сталь' },
      { specName: 'Тип', value: 'Режущий' },
      { specName: 'Размер', value: '№10' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
    ]
  },
  'Зажим Кохера': {
    typeName: 'Хирургический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип', value: 'Фиксирующий' },
      { specName: 'Размер', value: '15 см' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
    ]
  },
  'Ножницы хирургические': {
    typeName: 'Хирургический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип', value: 'Рассекающий' },
      { specName: 'Размер', value: '18 см' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
    ]
  },
  'Иглодержатель Mathieu': {
    typeName: 'Хирургический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип', value: 'Шовный' },
      { specName: 'Размер', value: '14 см' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
    ]
  },
  'Набор хирургических зондов': {
    typeName: 'Хирургический инструмент',
    specs: [
      { specName: 'Материал', value: 'Нержавеющая сталь' },
      { specName: 'Тип', value: 'Диагностический' },
      { specName: 'Размер', value: '10-15 см' },
      { specName: 'Стерилизация', value: 'Автоклавирование' },
    ]
  },
  'Электронож Bovie': {
    typeName: 'Хирургическое оборудование',
    specs: [
      { specName: 'Мощность', value: '250 Вт' },
      { specName: 'Тип', value: 'Высокочастотный' },
      { specName: 'Напряжение', value: '220 В' },
      { specName: 'Вес', value: '3.5 кг' },
    ]
  },
  'Отсасыватель хирургический Medela': {
    typeName: 'Хирургическое оборудование',
    specs: [
      { specName: 'Мощность', value: '150 Вт' },
      { specName: 'Тип', value: 'Вакуумный' },
      { specName: 'Напряжение', value: '220 В' },
      { specName: 'Вес', value: '8 кг' },
    ]
  },
  'Осветительная система Aura': {
    typeName: 'Хирургическое оборудование',
    specs: [
      { specName: 'Мощность', value: '100 Вт' },
      { specName: 'Тип', value: 'Светодиодный' },
      { specName: 'Напряжение', value: '220 В' },
      { specName: 'Вес', value: '5 кг' },
    ]
  },
  'Аспиратор хирургический': {
    typeName: 'Хирургическое оборудование',
    specs: [
      { specName: 'Мощность', value: '120 Вт' },
      { specName: 'Тип', value: 'Аспирационный' },
      { specName: 'Напряжение', value: '220 В' },
      { specName: 'Вес', value: '6 кг' },
    ]
  },
  'Монитор пациента GE Healthcare': {
    typeName: 'Хирургическое оборудование',
    specs: [
      { specName: 'Мощность', value: '200 Вт' },
      { specName: 'Тип', value: 'Монитор' },
      { specName: 'Напряжение', value: '220 В' },
      { specName: 'Вес', value: '4.2 кг' },
    ]
  },
  'Кардиомонитор Philips MX400': {
    typeName: 'Кардиомонитор',
    specs: [
      { specName: 'Диагональ экрана', value: '12 дюймов' },
      { specName: 'Количество отведений', value: '12' },
      { specName: 'Пульсоксиметрия', value: 'Да' },
      { specName: 'Масса', value: '4.5 кг' },
    ]
  },
  'Кардиомонитор Schiller MT-200': {
    typeName: 'Кардиомонитор',
    specs: [
      { specName: 'Диагональ экрана', value: '10 дюймов' },
      { specName: 'Количество отведений', value: '12' },
      { specName: 'Пульсоксиметрия', value: 'Да' },
      { specName: 'Масса', value: '3.8 кг' },
    ]
  },
  'Кардиомонитор Mindray PM-9000': {
    typeName: 'Кардиомонитор',
    specs: [
      { specName: 'Диагональ экрана', value: '12.1 дюймов' },
      { specName: 'Количество отведений', value: '12' },
      { specName: 'Пульсоксиметрия', value: 'Да' },
      { specName: 'Масса', value: '4.2 кг' },
    ]
  },
  'Кардиомонитор Fukuda Denshi': {
    typeName: 'Кардиомонитор',
    specs: [
      { specName: 'Диагональ экрана', value: '15 дюймов' },
      { specName: 'Количество отведений', value: '12' },
      { specName: 'Пульсоксиметрия', value: 'Да' },
      { specName: 'Масса', value: '5 кг' },
    ]
  },
  'Кардиомонитор Drager Vista 120': {
    typeName: 'Кардиомонитор',
    specs: [
      { specName: 'Диагональ экрана', value: '12 дюймов' },
      { specName: 'Количество отведений', value: '12' },
      { specName: 'Пульсоксиметрия', value: 'Да' },
      { specName: 'Масса', value: '3.5 кг' },
    ]
  },
  'ЭКГ-аппарат Schiller AT-101': {
    typeName: 'Электрокардиограф',
    specs: [
      { specName: 'Количество каналов', value: '1' },
      { specName: 'Скорость бумаги', value: '25 мм/с' },
      { specName: 'Вес', value: '2.5 кг' },
      { specName: 'Автоинтерпретация', value: 'Нет' },
    ]
  },
  'ЭКГ-аппарат Cardioline Touch': {
    typeName: 'Электрокардиограф',
    specs: [
      { specName: 'Количество каналов', value: '3' },
      { specName: 'Скорость бумаги', value: '25 мм/с' },
      { specName: 'Вес', value: '3.2 кг' },
      { specName: 'Автоинтерпретация', value: 'Да' },
    ]
  },
  'ЭКГ-аппарат Bionet CardioCare': {
    typeName: 'Электрокардиограф',
    specs: [
      { specName: 'Количество каналов', value: '12' },
      { specName: 'Скорость бумаги', value: '25 мм/с' },
      { specName: 'Вес', value: '4 кг' },
      { specName: 'Автоинтерпретация', value: 'Да' },
    ]
  },
  'ЭКГ-аппарат Contec TLC5000': {
    typeName: 'Электрокардиограф',
    specs: [
      { specName: 'Количество каналов', value: '12' },
      { specName: 'Скорость бумаги', value: '25 мм/с' },
      { specName: 'Вес', value: '2.8 кг' },
      { specName: 'Автоинтерпретация', value: 'Да' },
    ]
  },
  'ЭКГ-аппарат Edan SE-1201': {
    typeName: 'Электрокардиограф',
    specs: [
      { specName: 'Количество каналов', value: '12' },
      { specName: 'Скорость бумаги', value: '25 мм/с' },
      { specName: 'Вес', value: '3.5 кг' },
      { specName: 'Автоинтерпретация', value: 'Да' },
    ]
  },
  'Имплант тазобедренного сустава': {
    typeName: 'Ортопедический имплант',
    specs: [
      { specName: 'Материал', value: 'Титан+керамика' },
      { specName: 'Размер', value: 'S-M-L' },
      { specName: 'Тип фиксации', value: 'Цементный' },
      { specName: 'Срок службы', value: '15+ лет' },
    ]
  },
  'Имплант коленного сустава': {
    typeName: 'Ортопедический имплант',
    specs: [
      { specName: 'Материал', value: 'Титан+полиэтилен' },
      { specName: 'Размер', value: 'M-L' },
      { specName: 'Тип фиксации', value: 'Бескементный' },
      { specName: 'Срок службы', value: '15+ лет' },
    ]
  },
  'Пластина для остеосинтеза': {
    typeName: 'Ортопедический имплант',
    specs: [
      { specName: 'Материал', value: 'Титан' },
      { specName: 'Размер', value: '4-12 отверстий' },
      { specName: 'Тип фиксации', value: 'Винтовая' },
      { specName: 'Срок службы', value: '10 лет' },
    ]
  },
  'Винт кортикальный': {
    typeName: 'Ортопедический имплант',
    specs: [
      { specName: 'Материал', value: 'Титан' },
      { specName: 'Размер', value: '3.5-6.5 мм' },
      { specName: 'Тип фиксации', value: 'Резьбовой' },
      { specName: 'Срок службы', value: 'Бессрочно' },
    ]
  },
  'Имплант плечевого сустава': {
    typeName: 'Ортопедический имплант',
    specs: [
      { specName: 'Материал', value: 'Титан+полиэтилен' },
      { specName: 'Размер', value: 'M-L' },
      { specName: 'Тип фиксации', value: 'Бескементный' },
      { specName: 'Срок службы', value: '15+ лет' },
    ]
  },
  'Бандаж на голеностоп': {
    typeName: 'Ортопедический бандаж',
    specs: [
      { specName: 'Материал', value: 'Неопрен' },
      { specName: 'Размер', value: 'S-XL' },
      { specName: 'Тип', value: 'Голеностопный' },
      { specName: 'Степень фиксации', value: 'Средняя' },
    ]
  },
  'Бандаж на коленный сустав': {
    typeName: 'Ортопедический бандаж',
    specs: [
      { specName: 'Материал', value: 'Неопрен' },
      { specName: 'Размер', value: 'S-XL' },
      { specName: 'Тип', value: 'Коленный' },
      { specName: 'Степень фиксации', value: 'Средняя' },
    ]
  },
  'Бандаж на лучезапястный сустав': {
    typeName: 'Ортопедический бандаж',
    specs: [
      { specName: 'Материал', value: 'Неопрен' },
      { specName: 'Размер', value: 'S-XL' },
      { specName: 'Тип', value: 'Лучезапястный' },
      { specName: 'Степень фиксации', value: 'Средняя' },
    ]
  },
  'Бандаж на плечевой сустав': {
    typeName: 'Ортопедический бандаж',
    specs: [
      { specName: 'Материал', value: 'Неопрен' },
      { specName: 'Размер', value: 'S-XL' },
      { specName: 'Тип', value: 'Плечевой' },
      { specName: 'Степень фиксации', value: 'Высокая' },
    ]
  },
  'Бандаж поясничный': {
    typeName: 'Ортопедический бандаж',
    specs: [
      { specName: 'Материал', value: 'Неопрен' },
      { specName: 'Размер', value: 'S-XL' },
      { specName: 'Тип', value: 'Поясничный' },
      { specName: 'Степень фиксации', value: 'Высокая' },
    ]
  },
};

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

async function apiRequest(endpoint, method = 'POST', data = null, ignoreConflict = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error(`Эндпоинт ${endpoint} не существует (404)`);
      }
      throw new Error(`Ожидался JSON, получен ${contentType}`);
    }

    const responseData = await response.json();
    
    if (!response.ok) {
      if (ignoreConflict && response.status === 409) {
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(responseData)}`);
    }
    
    return responseData;
  } catch (error) {
    if (ignoreConflict && error.message.includes('409')) {
      return null;
    }
    throw error;
  }
}

async function getExistingData() {
  try {
    const [categoriesRes, typesRes, specsRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/categories`),
      fetch(`${API_BASE_URL}/types`),
      fetch(`${API_BASE_URL}/specs`),
      fetch(`${API_BASE_URL}/products`)
    ]);
    
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const types = typesRes.ok ? await typesRes.json() : [];
    const specs = specsRes.ok ? await specsRes.json() : [];
    const products = productsRes.ok ? await productsRes.json() : [];
    
    return {
      categories: Array.isArray(categories) ? categories.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
      }, {}) : {},
      types: Array.isArray(types) ? types.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
      }, {}) : {},
      specs: Array.isArray(specs) ? specs.reduce((acc, item) => {
        const key = `${item.name}|${item.typeID}`;
        acc[key] = item;
        return acc;
      }, {}) : {},
      products: Array.isArray(products) ? products.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
      }, {}) : {},
    };
  } catch (error) {
    console.log('⚠️ Не удалось получить существующие данные');
    return {
      categories: {},
      types: {},
      specs: {},
      products: {},
    };
  }
}

// ============================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================

async function seedDatabase() {
  console.log('🌱 Начинаем полное заполнение базы данных...');
  console.log(`🔗 API базовый URL: ${API_BASE_URL}\n`);

  // Проверяем существующие данные
  console.log('📊 Проверяем существующие данные...');
  const existing = await getExistingData();
  console.log(`  Найдено категорий: ${Object.keys(existing.categories).length}`);
  console.log(`  Найдено типов: ${Object.keys(existing.types).length}`);
  console.log(`  Найдено спецификаций: ${Object.keys(existing.specs).length}`);
  console.log(`  Найдено товаров: ${Object.keys(existing.products).length}\n`);

  const created = {
    categories: { ...existing.categories },
    types: { ...existing.types },
    specs: { ...existing.specs },
    products: { ...existing.products },
  };

  let totalAdded = 0;

  try {
    // ============================================
    // 1. СОЗДАНИЕ КАТЕГОРИЙ
    // ============================================
    console.log('📁 Создаем категории...');
    for (const categoryName of categories) {
      if (created.categories[categoryName]) {
        console.log(`  ⚠️ Категория "${categoryName}" уже существует (ID: ${created.categories[categoryName].id})`);
        continue;
      }
      const result = await apiRequest('/categories', 'POST', { name: categoryName }, true);
      if (result) {
        created.categories[categoryName] = result;
        console.log(`  ✅ Создана категория: ${categoryName} (ID: ${result.id})`);
        totalAdded++;
      }
    }

    // ============================================
    // 2. СОЗДАНИЕ ТИПОВ
    // ============================================
    console.log('\n📂 Создаем типы...');
    for (const typeData of typesData) {
      if (created.types[typeData.name]) {
        console.log(`  ⚠️ Тип "${typeData.name}" уже существует (ID: ${created.types[typeData.name].id})`);
        continue;
      }
      const category = created.categories[typeData.categoryName];
      if (!category) {
        console.log(`  ❌ Категория "${typeData.categoryName}" не найдена`);
        continue;
      }
      const result = await apiRequest('/types', 'POST', {
        name: typeData.name,
        categoryID: category.id,
      }, true);
      if (result) {
        created.types[typeData.name] = result;
        console.log(`  ✅ Создан тип: ${typeData.name} (ID: ${result.id})`);
        totalAdded++;
      }
    }

    // ============================================
    // 3. СОЗДАНИЕ СПЕЦИФИКАЦИЙ
    // ============================================
    console.log('\n📋 Создаем спецификации...');
    for (const specData of specsData) {
      const type = created.types[specData.typeName];
      if (!type) {
        console.log(`  ❌ Тип "${specData.typeName}" не найден`);
        continue;
      }
      
      const key = `${specData.name}|${type.id}`;
      if (created.specs[key]) {
        console.log(`  ⚠️ Спецификация "${specData.name}" уже существует для типа "${specData.typeName}"`);
        continue;
      }
      
      const result = await apiRequest('/specs', 'POST', {
        name: specData.name,
        typeID: type.id,
      }, true);
      if (result) {
        const newKey = `${result.name}|${result.typeID}`;
        created.specs[newKey] = result;
        console.log(`  ✅ Создана спецификация: ${specData.name} (ID: ${result.id})`);
        totalAdded++;
      }
    }

    // ============================================
    // 4. СОЗДАНИЕ ТОВАРОВ
    // ============================================
    console.log('\n📦 Создаем товары...');
    for (const productData of productsData) {
      if (created.products[productData.name]) {
        console.log(`  ⚠️ Товар "${productData.name}" уже существует (ID: ${created.products[productData.name].id})`);
        continue;
      }
      const type = created.types[productData.typeName];
      if (!type) {
        console.log(`  ❌ Тип "${productData.typeName}" не найден`);
        continue;
      }
      const result = await apiRequest('/products', 'POST', {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        quantity: productData.quantity,
        typeID: type.id,
      }, true);
      if (result) {
        created.products[productData.name] = result;
        console.log(`  ✅ Создан товар: ${productData.name} (ID: ${result.id})`);
        totalAdded++;
      }
    }

    // ============================================
    // 5. ДОБАВЛЕНИЕ ЗНАЧЕНИЙ СВОЙСТВ
    // ============================================
    console.log('\n🔧 Добавляем значения свойств к товарам...');
    let specValueCount = 0;
    let skippedCount = 0;

    for (const [productName, productData] of Object.entries(productSpecsData)) {
      const product = created.products[productName];
      if (!product) {
        console.log(`  ⚠️ Товар "${productName}" не найден`);
        skippedCount += productData.specs.length;
        continue;
      }

      const type = created.types[productData.typeName];
      if (!type) {
        console.log(`  ⚠️ Тип "${productData.typeName}" не найден для товара "${productName}"`);
        skippedCount += productData.specs.length;
        continue;
      }

      // Собираем все specID для этого товара
      const specsToAdd = [];
      for (const sv of productData.specs) {
        const key = `${sv.specName}|${type.id}`;
        const spec = created.specs[key];
        if (!spec) {
          console.log(`  ⚠️ Спецификация "${sv.specName}" не найдена для типа "${productData.typeName}"`);
          skippedCount++;
          continue;
        }
        specsToAdd.push({
          specID: spec.id,
          value: sv.value,
        });
      }

      if (specsToAdd.length === 0) {
        console.log(`  ⚠️ Нет свойств для добавления товару "${productName}"`);
        continue;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/products/${product.id}/specs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ specs: specsToAdd }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.log(`  ❌ Ошибка при добавлении свойств для "${productName}": ${JSON.stringify(result)}`);
          skippedCount += specsToAdd.length;
          continue;
        }

        console.log(`  ✅ Для товара "${productName}" добавлено ${result.added} свойств из ${specsToAdd.length}`);
        specValueCount += result.added || 0;
        skippedCount += specsToAdd.length - (result.added || 0);

      } catch (error) {
        console.log(`  ❌ Ошибка запроса для "${productName}": ${error.message}`);
        skippedCount += specsToAdd.length;
      }
    }

    // ============================================
    // ИТОГИ
    // ============================================
    console.log('\n🎉 База данных успешно заполнена!');
    console.log(`📊 Итоги:`);
    console.log(`  - Создано новых записей: ${totalAdded}`);
    console.log(`  - Категории: ${Object.keys(created.categories).length}`);
    console.log(`  - Типы: ${Object.keys(created.types).length}`);
    console.log(`  - Спецификации: ${Object.keys(created.specs).length}`);
    console.log(`  - Товары: ${Object.keys(created.products).length}`);
    console.log(`  - Значения свойств: ${specValueCount}`);
    if (skippedCount > 0) {
      console.log(`  - Пропущено: ${skippedCount}`);
    }

  } catch (error) {
    console.error('\n❌ Ошибка при заполнении базы:', error.message);
    process.exit(1);
  }
}

// ============================================
// ЗАПУСК
// ============================================
seedDatabase();