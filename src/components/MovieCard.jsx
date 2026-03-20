import { useState } from 'react';

// Composant affichant la carte d'un film avec son affiche, son titre, son année et son synopsis
function MovieCard({ movie }) {
    // Contrôle l'affichage complet ou tronqué du synopsis
    const [isExpanded, setIsExpanded] = useState(false);

    // Image de remplacement si l'affiche est absente ou non disponible
    const fallbackPoster = '/no-poster.svg';
    // L'API renvoie "N/A" quand l'affiche n'existe pas — on utilise alors le fallback
    const poster =
        movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster;

    // L'API renvoie "N/A" quand le synopsis n'est pas disponible
    const plot =
        movie.Plot && movie.Plot !== 'N/A'
            ? movie.Plot
            : 'Description indisponible.';

    // Synopsis tronqué à 140 caractères pour l'affichage réduit
    const shortPlot = plot.slice(0, 140);
    // Indique si le synopsis est assez long pour nécessiter un bouton "Lire la suite"
    const needsTruncation = plot.length > 140;

    // Remplace l'image cassée par le fallback SVG
    // On annule onerror pour éviter une boucle infinie si le fallback lui-même échoue
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = fallbackPoster;
    };

    return (
        <div className='movie-card'>
            <img
                src={poster}
                alt={`Affiche de ${movie.Title}`}
                className='movie-poster'
                onError={handleImageError}
            />
            <h3 className='movie-title'>{movie.Title}</h3>
            <p className='movie-year'>Année : {movie.Year || ''}</p>

            {/* Affiche le synopsis tronqué ou complet selon l'état isExpanded */}
            <p className='movie-plot'>
                {needsTruncation && !isExpanded ? shortPlot + '…' : plot}
            </p>

            {/* Bouton "Lire la suite / Réduire" affiché uniquement si le synopsis est long */}
            {needsTruncation && (
                <button
                    type='button'
                    className='toggle-plot'
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Réduire' : 'Lire la suite'}
                </button>
            )}
        </div>
    );
}

export default MovieCard;
