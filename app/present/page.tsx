import type { Metadata } from "next";
import { Deck } from "@/components/pitch/deck";

export const metadata: Metadata = {
  title: "Презентация — Фикс",
  description: "Презентация на 3 минуты: итог по ТЗ и бэкенд прототипа Фикс.",
};

export default function PresentPage() {
  return <Deck />;
}
