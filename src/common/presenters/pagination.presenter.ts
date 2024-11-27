type PaginationPresenterProps<T = any> = {
  data: T[];
  meta: PaginationMetaPresenterProps;
};

export class PaginationPresenter<T = any> {
  data: T[];
  meta: PaginationMetaPresenter;

  constructor({ data, meta }: PaginationPresenterProps<T>) {
    this.data = data;
    this.meta = new PaginationMetaPresenter(meta);
  }
}

type PaginationMetaPresenterProps = {
  total: number;
  itemsPerPage: number;
  currentPage: number;
};

class PaginationMetaPresenter {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  lastPage: number;
  hasPrev: boolean;
  hasNext: boolean;

  constructor({
    total,
    itemsPerPage,
    currentPage,
  }: PaginationMetaPresenterProps) {
    this.total = total;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.lastPage = Math.ceil(total / itemsPerPage);
    this.hasPrev = currentPage > 1;
    this.hasNext = currentPage < Math.ceil(total / itemsPerPage);
  }
}
