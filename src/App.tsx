import { FC } from 'react';

import { WelcomeMessageText } from './components/WelcomeMessage';
import LogWorkedHoursForm from './containers/LogWorkedHoursForm';

const App: FC = () => (
  <div className='flex justify-center flex-col lg:max-w-3xl mx-auto'>
    <WelcomeMessageText />
    <LogWorkedHoursForm />
  </div>
);

export default App;
