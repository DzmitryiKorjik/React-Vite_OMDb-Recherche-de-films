import { useState } from 'react';
import MovieCard from './components/MovieCard';
import { searchMovies } from './components/api';
import './App.css';

function App() {
    // Valeur saisie dans le champ de recherche
    const [searchTerm, setSearchTerm] = useState('');
    // Liste des films récupérés avec leurs détails
    const [movies, setMovies] = useState([]);
    // Message d'information affiché à l'utilisateur (erreur, résultats, chargement...)
    const [message, setMessage] = useState('');
    // Indicateur de chargement pour désactiver le bouton et afficher un feedback
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMovies([]);
        setMessage('');
        setIsLoading(true);
        setMessage('Recherche en cours…');
        try {
            const results = await searchMovies(searchTerm);
            setMessage(`${results.length} résultat(s) trouvé(s).`);
            setMovies(results);
        } catch (error) {
            setMessage(error.message || "Erreur lors de l'appel à l'API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='app'>
            <header className='header'>
                <h1>🎬 Recherche de Films</h1>
                {/* Formulaire de recherche — soumis par la touche Entrée ou le bouton */}
                <form className='search-form' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='search-input'
                        placeholder='Rechercher un film...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Bouton désactivé pendant le chargement pour éviter les requêtes en double */}
                    <button
                        type='submit'
                        className='search-button'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </form>
            </header>

            {/* Affiche le message uniquement s'il est non vide */}
            {message && <p className='message'>{message}</p>}

            {/* Grille des cartes films — chaque film est identifié par son imdbID unique */}
            <div className='results-container'>
                {movies.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default App;
