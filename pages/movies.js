import Head from "next/head";
import styles from "../styles/Home.module.css";
import { MeiliSearch } from "meilisearch";
import { useState } from "react";

export default function Movies({ movies }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Paginated search</title>
        <meta name="description" content="Meilisearch pagination demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          {movies.results?.map((resource) => (
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
export const getStaticProps = async () => {
  const client = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST,
    apiKey: process.env.NEXT_PUBLIC_MEILI_TOKEN,
  });

  const index = await client.getIndex("movies");
  const movies = await index.getDocuments();
  console.log(movies);
  return {
    props: {
      movies,
    },
  };
};
