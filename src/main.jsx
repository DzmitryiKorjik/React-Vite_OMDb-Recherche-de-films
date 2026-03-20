// Point d'entrée de l'application React
// StrictMode active des vérifications supplémentaires en développement (double rendu, détection des effets obsolètes)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Monte l'application dans le div#root défini dans index.html
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
