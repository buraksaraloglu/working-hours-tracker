import { FC } from 'react';

import { WelcomeMessageText } from './components/WelcomeMessage';
import LogWorkedHoursForm from './containers/LogWorkedHoursForm';

const App: FC = () => (
  <div className='flex justify-center flex-col lg:max-w-3xl mx-auto my-8 p-4'>
    <WelcomeMessageText />
    <LogWorkedHoursForm />
  </div>
);

export default App;
