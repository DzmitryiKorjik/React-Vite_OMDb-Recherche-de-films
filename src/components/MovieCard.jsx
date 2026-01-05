import { useState } from 'react';

function MovieCard({ movie }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const fallbackPoster = '/no-poster.svg';
    const poster =
        movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster;
    const plot =
        movie.Plot && movie.Plot !== 'N/A'
            ? movie.Plot
            : 'Description indisponible.';
    const shortPlot = plot.slice(0, 140);
    const needsTruncation = plot.length > 140;

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
            <p className='movie-plot'>
                {needsTruncation && !isExpanded ? shortPlot + '…' : plot}
            </p>
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
