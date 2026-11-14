"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

type Slide =
  | { kind: "cover"; kicker: string; title: string; text: string }
  | { kind: "list"; kicker: string; title: string; points: string[] }
  | { kind: "checks"; kicker: string; title: string; points: string[] }
  | { kind: "cards"; kicker: string; title: string; cards: { title: string; text: string }[] }
  | {
      kind: "split";
      kicker: string;
      title: string;
      leftTitle: string;
      left: string[];
      rightTitle: string;
      right: string[];
    }
  | { kind: "rows"; kicker: string; title: string; rows: { name: string; text: string }[] }
  | { kind: "close"; kicker: string; title: string; points: string[] };

const SLIDES: Slide[] = [
  {
    kind: "cover",
    kicker: "МТС Беларусь · 3 минуты",
    title: "Фикс",
    text: "По заданию звонок сам становится задачей и днём в календаре. Ниже — итог и как это делает сервер.",
  },
  {
    kind: "checks",
    kicker: "Итог по ТЗ",
    title: "Что уже есть в прототипе",
    points: [
      "Исходящий звонок Ирины и входящий звонок Олега, с записью и полной расшифровкой.",
      "Абонента предупреждают, менеджер даёт согласие до начала работы.",
      "Из фразы берутся тип, срок и сумма: КП, встреча, оплата, документы, перезвон.",
      "Задача, событие календаря и напоминание появляются сами.",
      "Карточку можно подтвердить, исправить или удалить.",
      "Номера +375, суммы в Br, экран на русском.",
    ],
  },
  {
    kind: "cards",
    kicker: "Итог на экране",
    title: "Фраза уже лежит в системах",
    cards: [
      {
        title: "Ирина Павлова",
        text: "Исходящий, «БелКанц», +375 29. «Пришлите коммерческое предложение до среды» — карточка есть. Счёт 3 400 Br тоже.",
      },
      {
        title: "Олег Ким",
        text: "Входящий, «Неман Логистик», +375 33. КП до четверга, встреча во вторник в 15:00, бюджет 2 800 Br.",
      },
      {
        title: "Дальше по сроку",
        text: "Задачи стоят по дате. В календаре тот же день. Напоминание: в момент события, за 10 минут, за час, за день или своё время.",
      },
      {
        title: "На телефоне",
        text: "Со звонка можно вернуться в меню: главная, задачи, календарь и журнал.",
      },
    ],
  },
  {
    kind: "rows",
    kicker: "Бэкенд всего прототипа",
    title: "Сервер закрывает пункты ТЗ",
    rows: [
      { name: "Звонок", text: "Исходящий и входящий: сервер отдаёт запись и хранит полную расшифровку." },
      { name: "Согласие", text: "Пока менеджер не согласился, сервер звонок не пишет. Абонента предупреждают в начале." },
      { name: "Фраза", text: "Каждая реплика уходит на сервер. Там ищутся тип, дата и сумма. Пустую задачу сервер не создаёт." },
      { name: "CRM и календарь", text: "Нашлась договорённость — сервер пишет задачу и событие на тот же день." },
      { name: "Напоминание", text: "На событие сохраняется список: за 10 минут, за час, за день или своё время." },
      { name: "Правка", text: "Исправление уходит в задачу и календарь. Удаление снимает договорённость, задачу, событие и напоминание." },
      { name: "Журнал", text: "Каждое такое действие сервер пишет в журнал. Хранилище — файл AES-256-GCM, ключ в браузер не отдаётся." },
    ],
  },
  {
    kind: "split",
    kicker: "Хранение и настройка",
    title: "Шифрование и гибкость",
    leftTitle: "Шифрование",
    left: [
      "Звонки, задачи, календарь и журнал лежат одним файлом.",
      "Алгоритм AES-256-GCM. Ключ на сервере, в браузер не отдаётся.",
      "В рабочей версии это контур МТС.",
    ],
    rightTitle: "Гибкость",
    right: [
      "Тип обещания можно выключить.",
      "Слова и шаблон задачи меняются, следующий звонок их подхватывает.",
      "Напоминание: за 10 минут, за час, за день или своё время.",
      "Карточку можно исправить или удалить.",
    ],
  },
  {
    kind: "close",
    kicker: "Показ",
    title: "Открыть и показать",
    points: [
      "Главная → Ирина Павлова → «Просмотр».",
      "Запись и карточка «КП до среды».",
      "Календарь: тот же день и напоминание.",
      "Журнал: сервер записал, что создал задачу.",
    ],
  },
];

export function Deck() {
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;

  const go = useCallback(
    (next: number) => {
      setIndex(Math.min(last, Math.max(0, next)));
    },
    [last],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        go(index + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(last);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, last]);

  const slide = SLIDES[index];
  const dark = slide.kind === "cover";

  return (
    <div className={dark ? "flex h-dvh flex-col bg-[#1d2023] text-white" : "flex h-dvh flex-col bg-[#f6f7f9] text-[#1d2023]"}>
      <div className="h-1 shrink-0 bg-[#ff0032]" />
      <header className="flex items-center justify-between px-4 py-3 md:px-10">
        <p className="font-heading text-sm font-semibold">Фикс</p>
        <p className={dark ? "text-xs text-white/60" : "text-xs text-[#626c77]"}>
          {index + 1} / {SLIDES.length}
        </p>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-10">
        <div className="mx-auto flex h-full max-w-4xl flex-col justify-center py-4">
          <SlideView slide={slide} />
        </div>
      </main>

      <footer className={dark ? "flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 md:px-10" : "flex items-center justify-between gap-3 border-t border-[#1d2023]/8 bg-white px-4 py-3 md:px-10"}>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm disabled:opacity-30"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="size-4" />
            Назад
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === last}
            className="inline-flex h-10 items-center gap-1 rounded-xl bg-[#ff0032] px-3 text-sm text-white disabled:opacity-30"
            aria-label="Следующий слайд"
          >
            Дальше
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/" className={dark ? "text-white/80 underline-offset-2 hover:underline" : "text-[#626c77] underline-offset-2 hover:underline"}>
            Прототип
          </Link>
          <Link href="/report" className={dark ? "text-white/80 underline-offset-2 hover:underline" : "text-[#626c77] underline-offset-2 hover:underline"}>
            Отчёт
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SlideView({ slide }: { slide: Slide }) {
  if (slide.kind === "cover") {
    return (
      <div>
        <p className="text-sm font-medium tracking-wide text-[#ff0032] uppercase">{slide.kicker}</p>
        <h1 className="font-heading mt-4 text-6xl font-semibold tracking-tight md:text-8xl">{slide.title}</h1>
        <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/80 md:text-2xl">{slide.text}</p>
        <p className="mt-8 text-sm text-white/50">Алексей Морозов · продажи оргтехники</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[12px] font-medium tracking-wide text-[#ff0032] uppercase">{slide.kicker}</p>
      <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{slide.title}</h1>
      {slide.kind === "checks" ? (
        <ul className="mt-8 space-y-3">
          {slide.points.map((point) => (
            <li key={point} className="flex gap-3 text-lg leading-snug md:text-xl">
              <Check className="mt-1 size-5 shrink-0 text-[#ff0032]" strokeWidth={2.5} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {slide.kind === "list" || slide.kind === "close" ? (
        <ul className="mt-8 space-y-3">
          {slide.points.map((point) => (
            <li key={point} className="flex gap-3 text-lg leading-snug md:text-xl">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-[#ff0032]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {slide.kind === "cards" ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {slide.cards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white p-4 ring-1 ring-[#1d2023]/8">
              <p className="font-medium">{card.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#626c77]">{card.text}</p>
            </div>
          ))}
        </div>
      ) : null}
      {slide.kind === "rows" ? (
        <ul className="mt-6 divide-y divide-[#1d2023]/8 overflow-hidden rounded-2xl bg-white ring-1 ring-[#1d2023]/8">
          {slide.rows.map((row) => (
            <li key={row.name} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[9.5rem_1fr] sm:items-baseline sm:gap-4">
              <p className="text-sm font-medium text-[#ff0032]">{row.name}</p>
              <p className="text-sm leading-snug md:text-base">{row.text}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {slide.kind === "split" ? (
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <div className="h-full rounded-2xl bg-[#1d2023] p-5 text-white">
            <p className="text-[12px] font-medium tracking-wide text-[#ff0032] uppercase">{slide.leftTitle}</p>
            <ul className="mt-4 space-y-3">
              {slide.left.map((point) => (
                <li key={point} className="text-base leading-snug md:text-lg">{point}</li>
              ))}
            </ul>
          </div>
          <div className="h-full rounded-2xl bg-white p-5 ring-1 ring-[#1d2023]/8">
            <p className="text-[12px] font-medium tracking-wide text-[#ff0032] uppercase">{slide.rightTitle}</p>
            <ul className="mt-4 space-y-3">
              {slide.right.map((point) => (
                <li key={point} className="text-base leading-snug md:text-lg">{point}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      {slide.kind === "close" ? (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex h-11 items-center rounded-xl bg-[#ff0032] px-4 text-sm font-medium text-white">
            Открыть прототип
          </Link>
          <Link href="/report" className="inline-flex h-11 items-center rounded-xl bg-white px-4 text-sm font-medium ring-1 ring-[#1d2023]/10">
            Читать отчёт
          </Link>
        </div>
      ) : null}
    </div>
  );
}
