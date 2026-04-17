import { create } from "zustand";

const getPuter = () =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create((set, get) => {
  const buildAuthState = (user = null) => ({
    user,
    isAuthenticated: Boolean(user),
    signIn: get().auth.signIn,
    signOut: get().auth.signOut,
    refreshUser: get().auth.refreshUser,
    checkAuthStatus: get().auth.checkAuthStatus,
    getUser: () => user,
  });

  const setAuthState = (user = null) => {
    set({
      auth: buildAuthState(user),
      isLoading: false,
    });
  };

  const setError = (message) => {
    set({
      error: message,
      isLoading: false,
      auth: buildAuthState(null),
    });
  };

  const ensurePuter = () => {
    const puter = getPuter();

    if (!puter) {
      setError("Puter.js not available");
      return null;
    }

    return puter;
  };

  const checkAuthStatus = async () => {
    const puter = ensurePuter();
    if (!puter) return false;

    set({ isLoading: true, error: null });

    try {
      const isSignedIn = await puter.auth.isSignedIn();

      if (!isSignedIn) {
        setAuthState(null);
        return false;
      }

      const user = await puter.auth.getUser();
      setAuthState(user);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to check auth status";
      setError(message);
      return false;
    }
  };

  const signIn = async () => {
    const puter = ensurePuter();
    if (!puter) return;

    set({ isLoading: true, error: null });

    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      setError(message);
    }
  };

  const signOut = async () => {
    const puter = ensurePuter();
    if (!puter) return;

    set({ isLoading: true, error: null });

    try {
      await puter.auth.signOut();
      setAuthState(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign out failed";
      setError(message);
    }
  };

  const refreshUser = async () => {
    const puter = ensurePuter();
    if (!puter) return;

    set({ isLoading: true, error: null });

    try {
      const user = await puter.auth.getUser();
      setAuthState(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh user";
      setError(message);
    }
  };

  const init = () => {
    const puter = getPuter();

    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      if (!getPuter()) {
        setError("Puter.js failed to load within 10 seconds");
      }
    }, 10000);
  };

  const write = async (path, data) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.fs.write(path, data);
  };

  const readFile = async (path) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.fs.read(path);
  };

  const readDir = async (path) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.fs.readdir(path);
  };

  const upload = async (files) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.fs.upload(files);
  };

  const deleteFile = async (path) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.fs.delete(path);
  };

  const chat = async (prompt, imageURL, testMode, options) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.ai.chat(prompt, imageURL, testMode, options);
  };

  const feedback = async (path, message) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.ai.chat(
      [
        {
          role: "user",
          content: [
            {
              type: "file",
              puter_path: path,
            },
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
      { model: "claude-sonnet-4" },
    );
  };

  const img2txt = async (image, testMode) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.ai.img2txt(image, testMode);
  };

  const getKV = async (key) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.kv.get(key);
  };

  const setKV = async (key, value) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.kv.set(key, value);
  };

  const deleteKV = async (key) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.kv.delete(key);
  };

  const listKV = async (pattern, returnValues = false) => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.kv.list(pattern, returnValues);
  };

  const flushKV = async () => {
    const puter = ensurePuter();
    if (!puter) return;

    return puter.kv.flush();
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,

    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },

    fs: {
      write,
      read: readFile,
      readDir,
      upload,
      delete: deleteFile,
    },

    ai: {
      chat,
      feedback,
      img2txt,
    },

    kv: {
      get: getKV,
      set: setKV,
      delete: deleteKV,
      list: listKV,
      flush: flushKV,
    },

    init,
    clearError: () => set({ error: null }),
  };
});
