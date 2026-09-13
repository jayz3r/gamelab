import React from "react";
import { Link, useParams } from "react-router-dom";
import { hackathons } from "../data/hackathons";
import "../styles/app.css";

export const HackathonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const hackathon = hackathons.find((h) => h.slug === slug);

  if (!hackathon) {
    return (
      <section className="container">
        <p>Хакатон не найден.</p>
        <Link to="/" className="btn">
          Назад к хакатонам
        </Link>
      </section>
    );
  }

  return (
    <section className="container hackathon-page">
      <Link to="/" className="btn btn-outline" style={{ marginBottom: "1.5rem" }}>
        ← Назад к хакатонам
      </Link>

      <div className="hackathon-page-image">
        <img src={hackathon.image} alt={hackathon.title} />
      </div>

      <h2 className="hackathon-page-title">{hackathon.title}</h2>

      {hackathon.date && <p className="hackathon-page-meta">📅 {hackathon.date}</p>}
      {hackathon.location && <p className="hackathon-page-meta">📍 {hackathon.location}</p>}

      <div className="hackathon-page-content">
        {hackathon.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
};