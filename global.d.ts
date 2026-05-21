interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      expand: () => void;
      setHeaderColor: (color: string) => void;
      initDataUnsafe?: {
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
        };
      };
    };
  };
}
