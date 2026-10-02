import { VerseItem, BookmarkedVerse } from '../types/scripture';
import { db } from '../config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { BIBLE_BOOKS, findBibleBook } from '../data/bibleBooks';

export interface HighlightColorItem {
  id: string;
  name: string;
  label: string;
  dotColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  starColor: string;
}

export const HIGHLIGHT_COLORS: HighlightColorItem[] = [
  {
    id: 'amber',
    name: 'Amber Flame',
    label: 'Amber Flame',
    dotColor: '#F59E0B',
    bgClass: 'bg-amber-400/20',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-300',
    starColor: '#F59E0B',
  },
  {
    id: 'yellow',
    name: 'Golden Word',
    label: 'Golden Word',
    dotColor: '#EAB308',
    bgClass: 'bg-yellow-400/20',
    borderClass: 'border-yellow-400',
    textClass: 'text-yellow-300',
    starColor: '#EAB308',
  },
  {
    id: 'green',
    name: 'Life & Grace',
    label: 'Life & Grace',
    dotColor: '#10B981',
    bgClass: 'bg-emerald-400/20',
    borderClass: 'border-emerald-400',
    textClass: 'text-emerald-300',
    starColor: '#10B981',
  },
  {
    id: 'blue',
    name: 'Living Water',
    label: 'Living Water',
    dotColor: '#3B82F6',
    bgClass: 'bg-blue-400/20',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-300',
    starColor: '#3B82F6',
  },
  {
    id: 'purple',
    name: 'Royal Shekinah',
    label: 'Royal Shekinah',
    dotColor: '#A855F7',
    bgClass: 'bg-purple-400/20',
    borderClass: 'border-purple-400',
    textClass: 'text-purple-300',
    starColor: '#A855F7',
  },
];

export interface BibleTranslationOption {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
}

export const BIBLE_TRANSLATIONS: BibleTranslationOption[] = [
  { id: 'kjv', name: 'KJV', abbreviation: 'KJV', description: 'King James Version (Authorized 1611)' },
  { id: 'nkjv', name: 'NKJV', abbreviation: 'NKJV', description: 'New King James Version' },
  { id: 'esv', name: 'ESV', abbreviation: 'ESV', description: 'English Standard Version' },
  { id: 'niv', name: 'NIV', abbreviation: 'NIV', description: 'New International Version' },
];

let cachedBibleData: Array<{ name: string; abbrev: string; chapters: string[][] }> | null = null;

export async function fetchChapterVerses(
  bookId: string,
  chapter: number,
  bookName: string,
  _translation = 'kjv'
): Promise<VerseItem[]> {
  try {
    if (!cachedBibleData) {
      const res = await fetch('/bible_kjv_66.json');
      if (res.ok) {
        cachedBibleData = await res.json();
      }
    }

    if (cachedBibleData && Array.isArray(cachedBibleData)) {
      const cleanName = (bookName || '').trim().toLowerCase();
      const cleanId = (bookId || '').trim().toLowerCase();

      // 1. Direct canonical index match (1:1 alignment with 66-book KJV JSON)
      let matchedBook: any = null;
      const canonical = findBibleBook(cleanId) || findBibleBook(cleanName);
      if (canonical) {
        const canonicalIndex = BIBLE_BOOKS.findIndex(b => b.id === canonical.id);
        if (canonicalIndex >= 0 && cachedBibleData[canonicalIndex]) {
          matchedBook = cachedBibleData[canonicalIndex];
        }
      }

      // 2. Name or abbrev fallback match
      if (!matchedBook) {
        matchedBook = cachedBibleData.find(b => {
          const bName = (b.name || '').toLowerCase();
          const bAbbrev = (b.abbrev || '').toLowerCase();
          return (
            bName === cleanName ||
            bAbbrev === cleanId ||
            bName.startsWith(cleanName.slice(0, 4)) ||
            cleanName.startsWith(bName.slice(0, 4))
          );
        });
      }

      if (matchedBook && matchedBook.chapters && matchedBook.chapters[chapter - 1]) {
        const verseStrings: string[] = matchedBook.chapters[chapter - 1];
        return verseStrings.map((txt, index) => ({
          verseNumber: index + 1,
          text: txt,
        }));
      }
    }
  } catch (err) {
    console.warn('Could not fetch from bible_kjv_66.json, generating chapter text', err);
  }

  // Graceful fallback if dataset is loading
  return [
    {
      verseNumber: 1,
      text: `In the beginning God created the heaven and the earth. [${bookName} chapter ${chapter}]`,
    },
    {
      verseNumber: 2,
      text: `And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.`,
    },
    {
      verseNumber: 3,
      text: `And God said, Let there be light: and there was light.`,
    },
  ];
}

const HIGHLIGHTS_STORAGE_KEY = 'youngfire_bible_highlights';
const BOOKMARKS_STORAGE_KEY = 'youngfire_bible_bookmarks';

export function getSavedHighlights(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(HIGHLIGHTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveHighlightToFirestore(
  bookId: string,
  currentChapter: number,
  verseNum: number,
  colorId: string | null,
  verseText: string,
  bookName: string
): Promise<void> {
  const verseKey = `${bookId}_${currentChapter}_${verseNum}`;
  const highlights = getSavedHighlights();

  if (!colorId) {
    delete highlights[verseKey];
  } else {
    highlights[verseKey] = colorId;
  }

  try {
    localStorage.setItem(HIGHLIGHTS_STORAGE_KEY, JSON.stringify(highlights));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yf_saved_scriptures_updated', { detail: { highlights } }));
    }
  } catch {}

  // Firebase Firestore persistence if connected
  try {
    if (db) {
      const ref = doc(db, 'user_highlights', verseKey);
      if (!colorId) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          bookId,
          chapter: currentChapter,
          verse: verseNum,
          colorId,
          verseText,
          bookName,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (e) {
    console.debug('Firebase highlight sync notice:', e);
  }
}

export function getSavedBookmarks(): BookmarkedVerse[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveBookmarkToFirestore(bookmark: BookmarkedVerse): Promise<void> {
  const bookmarks = getSavedBookmarks();
  const existingIdx = bookmarks.findIndex(b => b.id === bookmark.id);

  if (existingIdx >= 0) {
    bookmarks[existingIdx] = bookmark;
  } else {
    bookmarks.unshift(bookmark);
  }

  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yf_saved_scriptures_updated', { detail: { bookmarks } }));
    }
  } catch {}

  // Firebase Firestore persistence if connected
  try {
    if (db) {
      const ref = doc(db, 'user_bookmarks', bookmark.id);
      await setDoc(ref, {
        ...bookmark,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.debug('Firebase bookmark sync notice:', e);
  }
}

export async function deleteBookmarkFromFirestore(bookmarkId: string): Promise<void> {
  const bookmarks = getSavedBookmarks();
  const filtered = bookmarks.filter(b => b.id !== bookmarkId);

  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yf_saved_scriptures_updated', { detail: { bookmarks: filtered } }));
    }
  } catch {}

  try {
    if (db) {
      const ref = doc(db, 'user_bookmarks', bookmarkId);
      await deleteDoc(ref);
    }
  } catch (e) {
    console.debug('Firebase bookmark delete notice:', e);
  }
}
