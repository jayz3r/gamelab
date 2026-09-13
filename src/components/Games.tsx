import React, { useEffect, useRef, useState } from "react";
import { games } from "../data/games";
import "../styles/app.css";

const INITIAL_VISIBLE_COUNT = 4;
const LOAD_MORE_STEP = 4;

/**
 * itch.io rate-limits embed requests aggressively — even 2-3 fired at the
 * same instant can trigger 429s. Simply lazy-loading on viewport-visibility
 * isn't enough, because several cards can become visible at once.
 *
 * This queue forces embeds to load strictly one at a time, with a delay
 * between each, no matter how many become visible simultaneously.
 */
const EMBED_LOAD_DELAY_MS = 800;
const embedLoadQueue: Array<() => void> = [];
let isProcessingQueue = false;

function enqueueEmbedLoad(callback: () => void) {
  embedLoadQueue.push(callback);
  if (!isProcessingQueue) {
    processQueue();
  }
}

function processQueue() {
  isProcessingQueue = true;
  const next = embedLoadQueue.shift();
  if (!next) {
    isProcessingQueue = false;
    return;
  }
  next();
  setTimeout(processQueue, EMBED_LOAD_DELAY_MS);
}

const LazyItchEmbed: React.FC<{ embedId: string; title: string; url: string }> = ({
  embedId,
  title,
  url,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState<"waiting" | "loading" | "loaded">("waiting");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          setStatus("loading");
          enqueueEmbedLoad(() => setShouldLoad(true));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="game-embed" ref={containerRef}>
      {shouldLoad ? (
        <iframe
          frameBorder="0"
          loading="lazy"
          src={`https://itch.io/embed/${embedId}?dark=true`}
          width="100%"
          height="167"
          allowFullScreen
          onLoad={() => setStatus("loaded")}
        >
          <a href={url}>{title}</a>
        </iframe>
      ) : (
        <div className="game-embed-placeholder" style={{ height: 167 }}>
          {status === "loading" && (
            <span className="game-embed-loading">Загрузка…</span>
          )}
        </div>
      )}
    </div>
  );
};

export const Games: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const visibleGames = games.slice(0, visibleCount);
  const hasMore = visibleCount < games.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, games.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <section id="games" className="container">
      <h3 className="section-title">Во что мы играем</h3>
      <div className="grid-games">
        {visibleGames.length > 0 ? (
          visibleGames.map((game, index) => (
            <div key={`game-${index}`} className="card glass game-card">
              {game.itchEmbedId ? (
                <LazyItchEmbed
                  embedId={game.itchEmbedId}
                  title={game.title}
                  url={game.url}
                />
              ) : game.image ? (
                <div className="game-image">
                  <img src={game.image} alt={game.title} loading="lazy" />
                </div>
              ) : null}
              <div className="game-content">
                <h4 className="game-title">{game.title}</h4>
                <p className="game-description">{game.description}</p>
              </div>
              {!game.itchEmbedId && (
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-small"
                  style={{ marginTop: "auto" }}
                >
                  Перейти
                </a>
              )}
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1" }}>Игры скоро появятся...</p>
        )}
      </div>

      {games.length > INITIAL_VISIBLE_COUNT && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          {hasMore ? (
            <button className="btn" onClick={handleShowMore}>
              Показать ещё
            </button>
          ) : (
            <button className="btn btn-outline" onClick={handleShowLess}>
              Свернуть
            </button>
          )}
        </div>
      )}
    </section>
  );
};