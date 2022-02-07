import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval'

import { EXTERNAL_ENDPOINTS } from '../shared/constants';

export enum UsernameFetchSource {
  indexedDb,
  externalApi,
};

type UserDataState = {
  data: {
    username: string;
    source: UsernameFetchSource;
  };
  loading: boolean;
  error: string | null;
}

const fetchRandomUsername = async (): Promise<string> => {
  const response = await fetch(EXTERNAL_ENDPOINTS.FETCH_USERNAME, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }
  
  return data.username;
}

const getUsernameFromBrowser = async (): Promise<string> => {
  const username = await get('username');
  return username;
}

const fetchUsername = async (): Promise<{ username: string, source: UsernameFetchSource }> => {
  const usernameFromIndexedDB = await getUsernameFromBrowser();
  if (usernameFromIndexedDB) {
    return {
      username: usernameFromIndexedDB,
      source: UsernameFetchSource.indexedDb,
    }
  }

  try {
    const username = await fetchRandomUsername();
    return {
      username,
      source: UsernameFetchSource.externalApi,
    }  
  }
  catch (error) {
    throw new Error("Couldn't fetch username");
  }
}


// TODO: This state can be extracted to a global state using a state management tool like Context, Redux, RecoilJS, etc.

/**
 * A hook that fetches the username and its source from the API or from the IndexedDB.
 * @returns {UserDataState} 
 */
export const useUserData = (): UserDataState => {
  const [userData, setUserData] = useState<UserDataState>({
    data: {
      username: '',
      source: UsernameFetchSource.externalApi,
    },
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!userData.data.username.length) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        loading: true,
      }));
      
      fetchUsername()
        .then(({ username, source }) => {
          setUserData((prevUserData) => ({
            ...prevUserData,
            data: {
              username,
              source,
            },
            loading: false,
          }));

          if (source === UsernameFetchSource.externalApi) {
            set('username', username);
          }
        })
        .catch((error) => {
          setUserData((prevUserData) => ({
            ...prevUserData,
            error,
            loading: false,
          }));
        });  
    }
  }, [userData.data.username.length]);

  return userData;
}
