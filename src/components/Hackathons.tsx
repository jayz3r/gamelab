import React from "react";
import { Link } from "react-router-dom";
import { hackathons } from "../data/hackathons";
import "../styles/app.css";

export const Hackathons: React.FC = () => {
  return (
    <section id="hackathons" className="container">
      <h3 className="section-title">Наши Хакатоны</h3>

      <div className="hackathons-grid">
        {hackathons.map((hackathon) => (
          <Link
            key={hackathon.slug}
            to={`/hackathons/${hackathon.slug}`}
            className="card glass hackathon-card hackathon-card-link"
          >
            <article>
              <div className="article-image">
                <img src={hackathon.image} alt={hackathon.title} />
              </div>
              <h4 className="article-title">{hackathon.title}</h4>
              <p className="article-excerpt">{hackathon.excerpt}</p>
              <span className="btn btn-small" style={{ marginTop: "auto" }}>
                Читать далее
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};