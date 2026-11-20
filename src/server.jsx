import {renderToString} from 'react-dom/server';import App from './App.jsx';
export const html=()=>renderToString(<App/>);
