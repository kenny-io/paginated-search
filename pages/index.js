import Head from "next/head";
import styles from "../styles/Home.module.css";
import { MeiliSearch } from "meilisearch";
import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    term: "",
    hitsPerPage: 8,
  });
  const [loading, setLoading] = useState(false);
  const client = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST,
    apiKey: process.env.NEXT_PUBLIC_MEILI_TOKEN,
  });
  const getNextPage = async () => {
    setLoading(true);
    setPage(page + 1);
    await client
      .index("movies")
      .search(searchQuery.term, {
        hitsPerPage: searchQuery.hitsPerPage,
        page: page,
      })
      .then((results) => {
        setSearchResults(results.hits);
        setLoading(false);
      });
  };
  const searchMovies = async (e) => {
    setSearchQuery({ ...searchQuery, term: e.target.value });
    client
      .index("movies")
      .search(searchQuery.term, {
        hitsPerPage: searchQuery.hitsPerPage,
      })
      .then((results) => {
        setSearchResults(results.hits);
      });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Paginated search</title>
        <meta name="description" content="Meilisearch pagination demo" />
        <link rel="icon" href="/mili.png" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Search your favorite movies</h1>
        <input
          className={styles.search}
          type="text"
          placeholder="Search for a movie..."
          onChange={(e) => searchMovies(e)}
        />
        <div className={styles.grid}>
          {searchResults.map((resource) => (
            <div key={resource.id} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resource.poster}
                alt={resource.name}
                width={200}
                height={300}
              />
              <h3>{resource.title}</h3>
              <p>{resource.overview.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
        {searchResults.length > 0 && (
          <div>
            <p>Page {page}</p>
            <button
              type="submit"
              className={styles.button}
              onClick={() => getNextPage()}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          With love by Kenny
        </a>
      </footer>
    </div>
  );
}
