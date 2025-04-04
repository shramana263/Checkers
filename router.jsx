import { createBrowserRouter } from 'react-router-dom';
import Computer from './src/Computer';
import App from './src/App';
import Landing from './src/Landing';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/app',
        element: <App />,
    },
    {
        path: '/computer',
        element: <Computer />,
    },
]);

export default router;