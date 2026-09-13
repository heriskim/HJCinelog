export interface Review {
  id: string;
  title: string;
  rating: number;
  review: string;
  oneLiner: string;
  createdAt: string;
  image?: string;
}

export interface ReviewInput {
  title: string;
  rating: number;
  review: string;
  oneLiner: string;
  image?: string;
}
