export interface IWatchHistoryAttributes {
  historyId: number;
  profileId: number;
  filmId: number;
  watchCount: number;
  lastWatchedAt: Date;
}

export interface IWatchHistoryCreationAttributes {
  profileId: number;
  filmId: number;
  watchCount?: number;
  lastWatchedAt?: Date;
}
