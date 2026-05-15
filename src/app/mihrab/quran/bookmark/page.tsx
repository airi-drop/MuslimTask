import type { Metadata } from "next";
import { BookmarkList } from "@/components/BookmarkList";

export const metadata: Metadata = {
  title: "Bookmark Al-Quran — MuslimTask",
};

export default function BookmarkPage() {
  return <BookmarkList />;
}
