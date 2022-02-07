import { FC } from 'react';
import { UsernameFetchSource, useUserData } from '../hooks/useUserData';

const getWelcomeMessage = (username: string, source: UsernameFetchSource): string => {
  if (source === UsernameFetchSource.indexedDb) {
    return `Welcome back ${username}!`;
  }

  return `Welcome ${username}!`;
}

export const WelcomeMessageText: FC = () => {
  const { data, loading, error } = useUserData();
  const { username, source } = data;

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="font-serif font-semibold text-xl">
      <h1>
        {
          loading ? 'Loading...' : getWelcomeMessage(username, source)
        }
      </h1>
    </div>
  );
}
