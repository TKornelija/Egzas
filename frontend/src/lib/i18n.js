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
    list: {
      title: "Helovino kolekcija",
      buy: "Pirkti",
      perDay: "/diena",
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
      priceLine: (pDay, pBuy) => `${pDay} /diena · Pirkti: ${pBuy}`,
      reservedMsg: (t, f, to, d) =>
        `Rezervacija #${t}\n${f} → ${to}\nDienos: ${d}`,
      orderedMsg: (t, q) => `Užsakymas #${t}\nKiekis: ${q}`,
      description: "Aprašymas",
      reviews: "Atsiliepimai",
      leaveReview: "Palikite atsiliepimą",
      commentPlaceholder: "Komentaras",
      send: "Siųsti",
      noReviews: "Šiuo metu nėra atsiliepimų.",
      commentRequired: "Komentaras privalomas.",
      reviewError: "Nepavyko pridėti atsiliepimo.",
      errorLoad: "Nepavyko gauti kostiumo duomenų.",
      requestError: "Užklausa nepavyko.",
      fillAll: "Įveskite visus reikalingus duomenis.",
      loading: "Kraunama...",
      notFound: "Kostiumas nerastas.",
      size: "Dydis",
    },
    faq: {
      name: "Dažniausiai užduodami klausimai",
    },
    accordion: {
      testOne: "Kaip galiu užsisakyti kostiumą?",
      answerOne: "Pasirink kostiumą, spausk „Rezervuoti“ ir užpildyk formą.",
      testTwo: "Ar galiu pakeisti užsakymo datą?",
      answerTwo:
        "Taip, susisiek su mumis el. paštu ir pakeisime datą, jei įmanoma.",
    },
    countdown: {
      name: "Iki Hellovyno liko visai nedaug!",
    },
    form: {
      succes: "Žinutė sėkmingai išsiųsta!",
      error: "Įvyko klaida, pabandykite vėliau.",
      name: "Neradai atsakymo? Užduok klausimą:",
      email: "Jūsų el. paštas",
      question: "Įveskite klausimą",
      send: "Siųsti",
    },
    featuredcostumes: {
      button: "Pamatyti visus kostiumus",
    },
    cart: {
      empty: "Jūsų krepšelis tuščias.",
      browse: "Naršyti kostiumus",
      remove: "Pašalinti",
      clear: "Išvalyti krepšelį",
      total: "Iš viso",
      checkout: "Tęsti pirkimą",
    },
    filter:{
      visi: "Visi",
      moterims: "Moterims",
      vyrams: "Vyrams",
      mergaitems: "Mergaitėms",
      berniukams: "Berniukams"
    },
    costumes:{
      paieska: "Ieškoti kostiumų"
    },
    footer: {
      returns: "Grąžinimai",
      shipping: "Pristatymas",
      faq: "DUK",
      privacy: "Privatumo politika",
      terms: "Taisyklės",
      contact: "Kontaktai",
    },
  },

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
    list: {
      title: "Halloween Collection",
      buy: "Buy",
      perDay: "/day",
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
      priceLine: (pDay, pBuy) => `${pDay}/day · Buy: ${pBuy}`,
      reservedMsg: (t, f, to, d) => `Reservation #${t}\n${f} → ${to}\nDays: ${d}`,
      orderedMsg: (t, q) => `Order #${t}\nQuantity: ${q}`,
      description: "Description",
      reviews: "Reviews",
      leaveReview: "Leave a Review",
      commentPlaceholder: "Your comment",
      send: "Send",
      noReviews: "No reviews yet.",
      commentRequired: "Comment is required.",
      reviewError: "Failed to add review.",
      errorLoad: "Failed to fetch costume details.",
      requestError: "Request failed.",
      fillAll: "Please fill in all required fields.",
      loading: "Loading...",
      notFound: "Costume not found.",
      size: "Size",
    },
    faq: {
      name: "Frequently asked questions",
    },
    accordion: {
      testOne: "How can I order a suit?",
      answerOne: "Choose a costume, click Book and fill out the form.",
      testTwo: "Can I change the date of my order?",
      answerTwo:
        "Yes, please contact us by email and we will change the date if possible.",
    },
    countdown: {
      name: "There's not much left until Halloween!",
    },
    form: {
      succes: "Message sent successfully!",
      error: "An error occurred, please try again later.",
      name: "Didn't find the answer? Ask a question:",
      email: "Your email",
      question: "Enter a question",
      send: "Send",
    },
    featuredcostumes: {
      button: "See all costumes",
    },
    cart: {
      empty: "Your cart is empty.",
      browse: "Browse costumes",
      remove: "Remove",
      clear: "Clear cart",
      total: "Total",
      checkout: "Proceed to checkout",
    },
    filter:{
      visi: "All",
      moterims: "For women",
      vyrams: "For men",
      mergaitems: "For girls",
      berniukams: "For boys"
    },
    costumes:{
      paieska: "Search for costumes"
    },
    footer: {
      returns: "Returns",
      shipping: "Shipping",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms",
      contact: "Contact",
    },
  },

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
    list: {
      title: "Хэллоуин коллекция",
      buy: "Купить",
      perDay: "/день",
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
      priceLine: (pDay, pBuy) => `${pDay} /день · Купить: ${pBuy}`,
      reservedMsg: (t, f, to, d) => `Бронь #${t}\n${f} → ${to}\nДней: ${d}`,
      orderedMsg: (t, q) => `Заказ #${t}\nКол-во: ${q}`,
      description: "Описание",
      reviews: "Отзывы",
      leaveReview: "Оставьте отзыв",
      commentPlaceholder: "Комментарий",
      send: "Отправить",
      noReviews: "Пока нет отзывов.",
      commentRequired: "Комментарий обязателен.",
      reviewError: "Не удалось добавить отзыв.",
      errorLoad: "Не удалось получить данные костюма.",
      requestError: "Ошибка запроса.",
      fillAll: "Заполните все обязательные поля.",
      loading: "Загрузка...",
      notFound: "Костюм не найден.",
      size: "Размер",
    },
    faq: {
      name: "Часто задаваемые вопросы",
    },
    accordion: {
      testOne: "Как я могу заказать костюм?",
      answerOne: "Выберите костюм, нажмите «Забронировать» и заполните форму.",
      testTwo: "Могу ли я изменить дату заказа?",
      answerTwo:
        "Да, пожалуйста, свяжитесь с нами по электронной почте, и мы изменим дату, если это возможно.",
    },
    countdown: {
      name: "До Хэллоуина осталось совсем немного!",
    },
    form: {
      succes: "Сообщение успешно отправлено!",
      error: "Произошла ошибка, повторите попытку позже.",
      name: "Не нашли ответ? Задайте вопрос:",
      email: "Ваш адрес электронной почты",
      question: "Введите вопрос",
      send: "Отправлять",
    },
    featuredcostumes: {
      button: "Посмотреть все костюмы",
    },
    cart: {
      empty: "Корзина пуста.",
      browse: "Посмотреть костюмы",
      remove: "Удалить",
      clear: "Очистить корзину",
      total: "Итого",
      checkout: "Оформить заказ",
    },
    filter:{
      visi: "Все",
      moterims: "Для женщин",
      vyrams: "Для мужчин",
      mergaitems: "Для девочек",
      berniukams: "Для мальчиков"
    },
    costumes:{
      paieska: "Поиск костюмов"
    },
    footer: {
      returns: "Возвраты",
      shipping: "Доставка",
      faq: "FAQ",
      privacy: "Политика конфиденциальности",
      terms: "Условия",
      contact: "Контакты",
    },
  },
};

const I18nCtx = createContext({
  lang: "en",
  setLang: () => {},
  t: (p) => p,
});

export function I18nProvider({ children }) {
  const saved =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null;
  const browser =
    typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
  const initial = saved || (["lt", "en", "ru"].includes(browser) ? browser : "en");

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
          if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
          else return path; // fallback
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
