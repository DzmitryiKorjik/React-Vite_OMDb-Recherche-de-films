import { useState } from 'react';
import MovieCard from './components/MovieCard';
import './App.css';

// Clé API OMDb chargée depuis les variables d'environnement (.env)
const API_KEY = import.meta.env.VITE_API_KEY;
// URL de base de l'API OMDb
const API_URL = 'https://www.omdbapi.com/';

function App() {
    // Valeur saisie dans le champ de recherche
    const [searchTerm, setSearchTerm] = useState('');
    // Liste des films récupérés avec leurs détails
    const [movies, setMovies] = useState([]);
    // Message d'information affiché à l'utilisateur (erreur, résultats, chargement...)
    const [message, setMessage] = useState('');
    // Indicateur de chargement pour désactiver le bouton et afficher un feedback
    const [isLoading, setIsLoading] = useState(false);

    // Recherche tous les films correspondant au titre donné
    // L'API OMDb pagine les résultats par 10 : on boucle jusqu'à tout récupérer
    const searchMovies = async (title) => {
        // Réinitialise les résultats précédents avant une nouvelle recherche
        setMovies([]);
        setMessage('');

        // Validation : empêche une recherche vide
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

            // Boucle de pagination : l'API OMDb renvoie 10 résultats par page
            while (true) {
                const res = await fetch(
                    `${API_URL}?s=${encodeURIComponent(
                        title,
                    )}&apikey=${API_KEY}&page=${page}`,
                );
                const data = await res.json();
                console.log('Réponse API recherche:', data);

                // L'API renvoie Response:"False" en cas d'échec (aucun résultat, clé invalide...)
                if (data.Response !== 'True') {
                    if (data.Error) {
                        setMessage(`Erreur API: ${data.Error}`);
                    }
                    break;
                }

                // Accumule les résultats de chaque page
                allMovies = allMovies.concat(data.Search);
                totalResults = Number(data.totalResults || allMovies.length);

                // OMDb: 10 résultats par page — arrêt quand tous les résultats sont récupérés
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

            // Récupérer les détails complets de chaque film (synopsis, genre, note...)
            // La recherche par ?s= ne retourne que les infos de base (titre, année, affiche)
            // On fait une requête ?i= par imdbID pour obtenir toutes les données
            const detailedMovies = await Promise.all(
                allMovies.map(async (m) => {
                    try {
                        const r = await fetch(
                            `${API_URL}?i=${m.imdbID}&plot=short&apikey=${API_KEY}`,
                        );
                        const data = await r.json();
                        // Si l'API retourne une erreur, utiliser les données de base
                        if (data.Response === 'False') {
                            console.warn(
                                `Erreur API pour ${m.imdbID}:`,
                                data.Error,
                            );
                            return m; // Retourner les données de recherche basiques
                        }
                        return data;
                    } catch (err) {
                        // En cas d'erreur réseau sur un film, on garde les données partielles
                        console.warn(`Erreur fetch pour ${m.imdbID}:`, err);
                        return m; // Retourner les données de recherche basiques
                    }
                }),
            );

            console.log('Films récupérés:', detailedMovies);
            setMovies(detailedMovies);
        } catch (error) {
            // Erreur réseau globale (pas de connexion, timeout...)
            console.error('Error fetching data:', error);
            setMessage(
                "Erreur lors de l'appel à l'API. Vérifiez votre connexion et votre clé OMDb.",
            );
        } finally {
            // Toujours désactiver le chargement, même en cas d'erreur
            setIsLoading(false);
        }
    };

    // Gère la soumission du formulaire et déclenche la recherche
    const handleSubmit = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page par défaut du formulaire
        searchMovies(searchTerm);
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
