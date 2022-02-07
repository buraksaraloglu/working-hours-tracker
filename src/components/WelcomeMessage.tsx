import { FC } from 'react';
import { UsernameFetchSource, useUserData } from '../hooks/useUserData';

const getWelcomeMessage = (username: string, source: UsernameFetchSource): string => {
  const welcomeMessage = source === UsernameFetchSource.indexedDb 
    ? 'Welcome back'
    : 'Welcome';
  return `${welcomeMessage} @${username}!`;
}

export const WelcomeMessageText: FC = () => {
  const { data, loading, error } = useUserData();
  const { username, source } = data;

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="font-serif font-semibold text-xl text-center">
      <h1>
        {
          loading ? 'Loading...' : getWelcomeMessage(username, source)
        }
      </h1>
    </div>
  );
}
