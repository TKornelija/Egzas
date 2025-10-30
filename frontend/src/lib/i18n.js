// src/lib/i18n.js
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
      priceLine: (pDay, pBuy) => `${pDay} €/diena · Pirkti: ${pBuy} €`,
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
      priceLine: (pDay, pBuy) => `$${pDay}/day · Buy: $${pBuy}`,
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
      priceLine: (pDay, pBuy) => `${pDay} $/день · Купить: ${pBuy} $`,
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
  // auto-detect first time, else use saved
  const saved =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null;
  const browser = (
    typeof navigator !== "undefined" ? navigator.language : "en"
  ).slice(0, 2);
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
      // very simple "a.b.c" path resolver
      t: (path, ...args) => {
        const parts = path.split(".");
        let cur = dict;
        for (const p of parts) {
          if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
          else return path; // fallback: return key
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
