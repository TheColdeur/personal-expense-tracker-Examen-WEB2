export interface Income {
  id: number;
  amount: number;
  source: string;
  description: string;
  date: string;
  receipt_upload?: string | null;
  create_at: string;
}

export type IncomeCreate = Omit<Income, "id" | "create_at">;

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IncomeResponse {
  revenues?: Income[];
  pagination?: Pagination;
}

export interface IncomeStats {
  total: number;
  overTime: Array<{ period: string; total: number }>;
}
