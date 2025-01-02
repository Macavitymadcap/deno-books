interface KeyedItem {
  [key: string]: unknown;
}

export interface Creator {
  name: string;
}

export interface Book {
  isbn: string;
  title: string;
  publisher: string | null;
  publish_date: string | null;
  page_count: number | null;
  source: string;
}

export interface BookRow extends Book, KeyedItem {
  created_at: string;
  updated_at: string;
}

export interface DatabaseID extends KeyedItem {
  id: number;
}

export interface CreatorRow extends Creator, DatabaseID {}
