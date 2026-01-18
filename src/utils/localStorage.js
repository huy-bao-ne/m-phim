const MY_LIST_KEY = 'netflix_clone_my_list';

export const getMyListFromStorage = () => {
  try {
    const stored = localStorage.getItem(MY_LIST_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveMyListToStorage = (movies) => {
  try {
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(movies));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const addToMyList = (movie) => {
  const currentList = getMyListFromStorage();
  const exists = currentList.some(m => m.id === movie.id);
  if (exists) {
    return currentList;
  }
  const newList = [...currentList, movie];
  saveMyListToStorage(newList);
  return newList;
};

export const removeFromMyList = (movieId) => {
  const currentList = getMyListFromStorage();
  const newList = currentList.filter(m => m.id !== movieId);
  saveMyListToStorage(newList);
  return newList;
};

export const toggleMyList = (movie) => {
  const currentList = getMyListFromStorage();
  const exists = currentList.some(m => m.id === movie.id);
  if (exists) {
    return removeFromMyList(movie.id);
  } else {
    return addToMyList(movie);
  }
};

export const isInMyList = (movieId) => {
  const currentList = getMyListFromStorage();
  return currentList.some(m => m.id === movieId);
};

export const clearMyList = () => {
  try {
    localStorage.removeItem(MY_LIST_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
