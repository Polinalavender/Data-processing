export interface ISubscriptionAttributes {
  subscriptionId: number;
  userId: number;
  plan: "FREE" | "SD" | "HD" | "UHD";
  startDate: Date;
  endDate: Date;
  price: number;
}

export interface ISubscriptionCreationAttributes {
  userId: number;
  plan: string;
  startDate: Date;
  endDate: Date;
  price: number;
}