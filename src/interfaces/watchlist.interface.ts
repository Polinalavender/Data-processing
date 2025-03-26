export interface IWatchlistAttributes {
  watchlistId: number;
  profileId: number;
  filmId: number;
  addedAt: Date;
}

export interface IWatchlistCreationAttributes {
  profileId: number;
  filmId: number;
}
