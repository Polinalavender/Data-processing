export interface IProfileAttributes {
  profileId: number;
  userId: number;
  name: string;
  age: number;
  language: string;
  preferences: string;
  photoUrl: string;
}

export interface IProfileCreationAttributes {
  userId: number;
  name: string;
  age: number;
  language?: string;
  preferences?: string;
  photoUrl: string;
}
