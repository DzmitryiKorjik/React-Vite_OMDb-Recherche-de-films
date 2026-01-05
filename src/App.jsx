import { useState } from 'react';
import MovieCard from './components/MovieCard';
import './App.css';

const API_KEY = '35a14e27'; // Remplacez par votre propre clé API OMDb (gratuit sur omdbapi.com)
const API_URL = 'https://www.omdbapi.com/';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const searchMovies = async (title) => {
        setMovies([]);
        setMessage('');

        if (!title.trim()) {
            setMessage('Veuillez saisir un titre de film.');
            return;
        }

        setIsLoading(true);
        setMessage('Recherche en cours…');

        try {
            let page = 1;
            let allMovies = [];
            let totalResults = 0;

            while (true) {
                const res = await fetch(
                    `${API_URL}?s=${encodeURIComponent(
                        title
                    )}&apikey=${API_KEY}&page=${page}`
                );
                const data = await res.json();
                console.log('Réponse API recherche:', data);

                if (data.Response !== 'True') {
                    if (data.Error) {
                        setMessage(`Erreur API: ${data.Error}`);
                    }
                    break;
                }

                allMovies = allMovies.concat(data.Search);
                totalResults = Number(data.totalResults || allMovies.length);

                // OMDb: 10 résultats par page
                if (allMovies.length >= totalResults) break;

                page += 1;

                // Option sécurité (évite boucle infinie si API renvoie mal)
                if (page > 50) break;
            }

            if (allMovies.length === 0) {
                setMessage(`Aucun résultat pour "${title}".`);
                setIsLoading(false);
                return;
            }

            setMessage(`${allMovies.length} résultat(s) trouvé(s).`);

            // Récupérer les détails de chaque film
            const detailedMovies = await Promise.all(
                allMovies.map(async (m) => {
                    try {
                        const r = await fetch(
                            `${API_URL}?i=${m.imdbID}&plot=short&apikey=${API_KEY}`
                        );
                        const data = await r.json();
                        // Si l'API retourne une erreur, utiliser les données de base
                        if (data.Response === 'False') {
                            console.warn(
                                `Erreur API pour ${m.imdbID}:`,
                                data.Error
                            );
                            return m; // Retourner les données de recherche basiques
                        }
                        return data;
                    } catch (err) {
                        console.warn(`Erreur fetch pour ${m.imdbID}:`, err);
                        return m; // Retourner les données de recherche basiques
                    }
                })
            );

            console.log('Films récupérés:', detailedMovies);
            setMovies(detailedMovies);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage(
                "Erreur lors de l'appel à l'API. Vérifiez votre connexion et votre clé OMDb."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        searchMovies(searchTerm);
    };

    return (
        <div className='app'>
            <header className='header'>
                <h1>🎬 Recherche de Films</h1>
                <form className='search-form' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='search-input'
                        placeholder='Rechercher un film...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type='submit'
                        className='search-button'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </form>
            </header>

            {message && <p className='message'>{message}</p>}

            <div className='results-container'>
                {movies.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default App;
