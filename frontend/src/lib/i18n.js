import React, { createContext, useContext, useMemo, useState } from "react";

const translations = {
  lt: {
    brand: "Freak Or Treat",
    nav: {
      home: "Pradžia",
      collection: "Kolekcija",
      how: "Kaip veikia",
      faq: "DUK",
      contact: "Kontaktai",
      cart: "Krepšelis",
      login: "Prisijungti",
      signup: "Registruotis",
    },

    home: {
      title: "Išlaisvink savo alter ego šį Heloviną",
      rentNow: "Nuomotis",
    },

    adminOrders: {
      title: "Užsakymai",
      id: "Užsakymo ID",
      customer: "Klientas",
      address: "Adresas",
      items: "Prekės",
      delivery: "Pristatymas",
      payment: "Apmokėjimas",
      status: "Statusas",
      created: "Sukurta",
      empty: "Dar nėra pateiktų užsakymų.",
      loading: "Kraunama...",
    },

    adminOrderDetails: {
      title: "Užsakymo informacija",
      status: "Užsakymo būsena",
      save: "Išsaugoti",
      saving: "Saugoma...",
      back: "Grįžti į sąrašą",
      customer: "Klientas",
      customerAddress: "Kliento adresas",
      items: "Užsakytos prekės",
      total: "Iš viso",
      created: "Sukurtas",
    },

    checkout: {
      checkoutMethodOne: "DPD kurjeris",
      checkoutMethodSecond: "DPD paštomatas",
      checkoutMethodThird: "Atsiėmimas parduotuvėje",
      paymentOne: "PayPal",
      paymentTwo: "Mastercard",
      paymentThree: "Apple Pay",
      paymentFour: "Mokėjimas parduotuvėje",
      storeOne: "Siaubo g. 12",
      storeSecond: "Košmarų g. 45",
      alert: "Jūsų sesija baigėsi. Prisijunkite iš naujo.",
      nameForm: "Įveskite vardą",
      surnameForm: "Įveskite pavardę",
      surname: "Pavardė",
      name: "Vardas",
      mail: "El. paštas",
      mailForm: "Įveskite el. paštą",
      adress: "Adresas",
      adressForm: "Įveskite adresą",
      postCode: "Pašto kodas",
      postCodeForm: "pvz. 01234",
      deliveringMethod: "Pasirinkite pristatymo būdą",
      shop: "Pasirinkite parduotuvę:",
      shopAdress: "-- Pasirinkite adresą --",
      paymentMethod: "Pasirinkite mokėjimo būdą",
      orderSummary: "Užsakymo santrauka",
      shipment: "Pristatymas:",
      shopOne: "Parduotuvė:",
      paymentSummary: "Mokėjimas:",
      sumSummary: "Mokėtina suma:",
      succes: "Užsakymas pavyko!",
      thanks: "Ačiū, kad apsipirkote FreakOrTreat 🎃",
      payment: "Apmokėjimas",
      buyer: "Pirkėjo duomenys",
      continue: "Tęsti apmokėjimą",
      notChosen: "Nepasirinkta",
      home: "Grįžti į pradžią",
      close: "Uždaryti",
    },

    list: {
      title: "Helovino kolekcija",
      buy: "Pirkti",
      perDay: "diena",
      buyNow: "Pirkti dabar",
      view: "Peržiūrėti",
    },

    details: {
      back: "Atgal",
      sizes: "Dydžiai",
      rent: "Nuoma",
      buy: "Pirkimas",
      from: "Nuo",
      to: "Iki",
      qty: "Kiekis",
      total: "Suma",
      days: "d.",
      reserve: "Rezervuoti",
      addToCart: "Į krepšelį",
      description: "Aprašymas",
      reviews: "Atsiliepimai",
      noReviews: "Šiuo metu nėra atsiliepimų.",
      send: "Siųsti",
      commentPlaceholder: "Komentaras",
      loading: "Kraunama...",
      notFound: "Kostiumas nerastas.",
      size: "Dydis",
    },

    faq: { name: "Dažniausiai užduodami klausimai" },

    cart: {
      empty: "Jūsų krepšelis tuščias.",
      browse: "Naršyti kostiumus",
      remove: "Pašalinti",
      clear: "Išvalyti krepšelį",
      total: "Iš viso",
      checkout: "Tęsti pirkimą",
    },

    footer: {
      returns: "Grąžinimai",
      shipping: "Pristatymas",
      faq: "DUK",
      privacy: "Privatumo politika",
      terms: "Taisyklės",
      contact: "Kontaktai",
    },

    contact: {
      title: "Kontaktai",
      company: "Freak Or Treat, MB",
      code: "Įmonės kodas",
      vat: "PVM kodas",
      phone: "Tel.",
      email: "El. paštas",
      address: "Adresas",
      note: "Dirbame I–V: 10:00–18:00",
    },
  },

  /* ---------------------- ENGLISH ---------------------- */

  en: {
    brand: "Freak Or Treat",
    nav: {
      home: "Home",
      collection: "Collection",
      how: "How it works",
      faq: "FAQ",
      contact: "Contact",
      cart: "Cart",
      login: "Login",
      signup: "Sign up",
    },

    home: {
      title: "Unleash Your Alter Ego This Halloween",
      rentNow: "Rent Now",
    },

    adminOrders: {
      title: "Orders",
      id: "Order ID",
      customer: "Customer",
      address: "Address",
      items: "Items",
      delivery: "Delivery",
      payment: "Payment",
      status: "Status",
      created: "Created",
      empty: "No orders yet.",
      loading: "Loading...",
    },

    adminOrderDetails: {
      title: "Order details",
      status: "Order status",
      save: "Save",
      saving: "Saving...",
      back: "Back to list",
      customer: "Customer",
      customerAddress: "Customer address",
      items: "Ordered items",
      total: "Total",
      created: "Created",
    },

    checkout: {
      checkoutMethodOne: "DPD courier",
      checkoutMethodSecond: "DPD parcel machine",
      checkoutMethodThird: "In-store pickup",
      paymentOne: "PayPal",
      paymentTwo: "Mastercard",
      paymentThree: "Apple Pay",
      paymentFour: "Payment in store",
      storeOne: "Horror Street 12",
      storeSecond: "Nightmares St. 45",
      alert: "Your session has expired. Please log in again.",
      nameForm: "Enter a name",
      surnameForm: "Enter last name",
      surname: "Last name",
      name: "Name",
      mail: "Email",
      mailForm: "Enter email",
      adress: "Address",
      adressForm: "Enter address",
      postCode: "Postal code",
      postCodeForm: "e.g. 01234",
      deliveringMethod: "Choose delivery method",
      shop: "Select a store:",
      shopAdress: "-- Select an address --",
      paymentMethod: "Select payment method",
      orderSummary: "Order summary",
      shipment: "Delivery:",
      paymentSummary: "Payment:",
      sumSummary: "Amount payable:",
      succes: "The order was successful!",
      thanks: "Thank you for shopping at FreakOrTreat 🎃",
      payment: "Payment",
      buyer: "Buyer details",
      continue: "Continue payment",
      notChosen: "Not selected",
      home: "Back to home",
      close: "Close",
    },

    list: {
      title: "Halloween Collection",
      buy: "Buy",
      perDay: "day",
      buyNow: "Buy Now",
      view: "View Details",
    },

    details: {
      back: "Back",
      sizes: "Sizes",
      rent: "Rent",
      buy: "Buy",
      from: "From",
      to: "To",
      qty: "Quantity",
      total: "Total",
      days: "day(s)",
      reserve: "Reserve",
      addToCart: "Add to Cart",
      description: "Description",
      reviews: "Reviews",
      noReviews: "No reviews yet.",
      send: "Send",
      commentPlaceholder: "Your comment",
      loading: "Loading...",
      notFound: "Costume not found.",
      size: "Size",
    },

    faq: { name: "Frequently asked questions" },

    cart: {
      empty: "Your cart is empty.",
      browse: "Browse costumes",
      remove: "Remove",
      clear: "Clear cart",
      total: "Total",
      checkout: "Proceed to checkout",
    },

    footer: {
      returns: "Returns",
      shipping: "Shipping",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms",
      contact: "Contact",
    },

    contact: {
      title: "Contact",
      company: "Freak Or Treat, MB",
      code: "Company code",
      vat: "VAT code",
      phone: "Phone",
      email: "Email",
      address: "Address",
      note: "We work Mon–Fri: 10:00–18:00.",
    },
  },

  /* ---------------------- RUSSIAN ---------------------- */

  ru: {
    brand: "Freak Or Treat",
    nav: {
      home: "Главная",
      collection: "Коллекция",
      how: "Как это работает",
      faq: "FAQ",
      contact: "Контакты",
      cart: "Корзина",
      login: "Войти",
      signup: "Регистрация",
    },

    home: {
      title: "Освободи своё альтер-эго на Хэллоуин",
      rentNow: "Арендовать",
    },

    adminOrders: {
      title: "Заказы",
      id: "ID заказа",
      customer: "Клиент",
      address: "Адрес",
      items: "Товары",
      delivery: "Доставка",
      payment: "Оплата",
      status: "Статус",
      created: "Создано",
      empty: "Заказов пока нет.",
      loading: "Загрузка...",
    },

    adminOrderDetails: {
      title: "Информация о заказе",
      status: "Статус заказа",
      save: "Сохранить",
      saving: "Сохранение...",
      back: "Назад к списку",
      customer: "Клиент",
      customerAddress: "Адрес клиента",
      items: "Товары",
      total: "Итого",
      created: "Создано",
    },

    checkout: {
      checkoutMethodOne: "курьер DPD",
      checkoutMethodSecond: "посылочный автомат DPD",
      checkoutMethodThird: "Самовывоз",
      paymentOne: "PayPal",
      paymentTwo: "Mastercard",
      paymentThree: "Apple Pay",
      paymentFour: "Оплата в магазине",
      storeOne: "Улица ужасов 12",
      storeSecond: "Кошмары ул. 45",
      alert: "Ваш сеанс истёк. Пожалуйста, войдите снова.",
      nameForm: "Введите имя",
      surnameForm: "Введите фамилию",
      surname: "Фамилия",
      name: "Имя",
      mail: "Электронная почта",
      mailForm: "Введите email",
      adress: "Адрес",
      adressForm: "Введите адрес",
      postCode: "Почтовый индекс",
      postCodeForm: "например 01234",
      deliveringMethod: "Выберите способ доставки",
      shop: "Выберите магазин:",
      shopAdress: "-- Выберите адрес --",
      paymentMethod: "Выберите способ оплаты",
      orderSummary: "Сводка заказа",
      shipment: "Доставка:",
      paymentSummary: "Оплата:",
      sumSummary: "К оплате:",
      succes: "Заказ успешно оформлен!",
      thanks: "Спасибо за покупку в FreakOrTreat 🎃",
      payment: "Оплата",
      buyer: "Данные покупателя",
      continue: "Продолжить оплату",
      notChosen: "Не выбрано",
      home: "Домой",
      close: "Закрыть",
    },

    list: {
      title: "Хэллоуин коллекция",
      buy: "Купить",
      perDay: "день",
      buyNow: "Купить сейчас",
      view: "Подробнее",
    },

    details: {
      back: "Назад",
      sizes: "Размеры",
      rent: "Аренда",
      buy: "Покупка",
      from: "С",
      to: "По",
      qty: "Кол-во",
      total: "Итого",
      days: "дн.",
      reserve: "Забронировать",
      addToCart: "В корзину",
      description: "Описание",
      reviews: "Отзывы",
      noReviews: "Нет отзывов.",
      send: "Отправить",
      commentPlaceholder: "Комментарий",
      loading: "Загрузка...",
      notFound: "Костюм не найден.",
      size: "Размер",
    },

    faq: { name: "Часто задаваемые вопросы" },

    cart: {
      empty: "Корзина пуста.",
      browse: "Посмотреть костюмы",
      remove: "Удалить",
      clear: "Очистить корзину",
      total: "Итого",
      checkout: "Оформить заказ",
    },

    footer: {
      returns: "Возвраты",
      shipping: "Доставка",
      faq: "FAQ",
      privacy: "Политика конфиденциальности",
      terms: "Условия",
      contact: "Контакты",
    },

    contact: {
      title: "Контакты",
      company: "Freak Or Treat, MB",
      code: "Код компании",
      vat: "ИНН",
      phone: "Тел.",
      email: "Email",
      address: "Адрес",
      note: "Работаем Пн–Пт: 10:00–18:00",
    },
  },
};

/* ------------------------------------------------------------------ */

const I18nCtx = createContext({
  lang: "en",
  setLang: () => {},
  t: (p) => p,
});

export function I18nProvider({ children }) {
  const saved =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null;

  const browser =
    typeof navigator !== "undefined"
      ? navigator.language.slice(0, 2)
      : "en";

  const initial =
    saved || (["lt", "en", "ru"].includes(browser) ? browser : "en");

  const [lang, setLang] = useState(initial);

  const dict = translations[lang] || translations.en;

  const value = useMemo(
    () => ({
      lang,
      setLang: (l) => {
        localStorage.setItem("lang", l);
        setLang(l);
      },
      t: (path, ...args) => {
        const parts = path.split(".");
        let cur = dict;

        for (const p of parts) {
          if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
            cur = cur[p];
          } else {
            return path;
          }
        }

        return typeof cur === "function" ? cur(...args) : cur;
      },
    }),
    [lang, dict]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
