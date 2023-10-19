export type Tutor = {
  name: string;
  description: string;
  title: string;
  tutorAddress: string;
  mintedAmount: string;
  maxMint: string;
  hourPrice: string;
};

export type TimeToken = {
  tokenId: number;
  tutor: string;
  student: string;
  price: string;
  mintedAt: string;
  redeemedAt: string;
  address?: string;
};
