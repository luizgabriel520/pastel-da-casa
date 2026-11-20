import {hydrateRoot,createRoot} from 'react-dom/client';import App from './App.jsx';
const el=document.getElementById('root');el.hasChildNodes()?hydrateRoot(el,<App/>):createRoot(el).render(<App/>);
