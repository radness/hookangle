export enum Category {
  Service = 'service',
  User = 'user',
  Membership = 'membership',
}

export interface IFAQ {
  _id: string;
  answer: string;
  create_dt: string;
  order: string;
  question: string;
  type: string;
  category: Category;
  update_dt: string;
  use_yn: string;
}
