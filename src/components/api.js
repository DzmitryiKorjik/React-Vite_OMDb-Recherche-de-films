const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://www.omdbapi.com/';

export async function searchMovies(title) {
    if (!title.trim()) {
        throw new Error('Veuillez saisir un titre de film.');
    }

    let page = 1;
    let allMovies = [];
    let totalResults = 0;

    while (true) {
        const res = await fetch(
            `${API_URL}?s=${encodeURIComponent(title)}&apikey=${API_KEY}&page=${page}`,
        );
        const data = await res.json();

        if (data.Response !== 'True') {
            if (data.Error) throw new Error(`Erreur API: ${data.Error}`);
            break;
        }

        allMovies = allMovies.concat(data.Search);
        totalResults = Number(data.totalResults || allMovies.length);

        if (allMovies.length >= totalResults) break;

        page += 1;
        if (page > 50) break;
    }

    if (allMovies.length === 0) {
        throw new Error(`Aucun résultat pour "${title}".`);
    }

    const detailedMovies = await Promise.all(
        allMovies.map(async (m) => {
            try {
                const r = await fetch(
                    `${API_URL}?i=${m.imdbID}&plot=short&apikey=${API_KEY}`,
                );
                const data = await r.json();
                if (data.Response === 'False') return m;
                return data;
            } catch {
                return m;
            }
        }),
    );

    return detailedMovies;
}
