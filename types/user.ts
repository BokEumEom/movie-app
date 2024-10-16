// movie-app/src/types/user.ts

export interface AccountStates {
  favorite: boolean;
  watchlist: boolean;
  rated: {
    value: number;
  } | null;
}

export interface AccountDetails {
  id: number;
  username: string;
  avatar: {
    tmdb: {
      avatar_path: string;
    };
  };
  // 기타 필요한 필드
}

export interface User {
  id: number;
  username: string;
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path: string | null;
    };
  };
}
