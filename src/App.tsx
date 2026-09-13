import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Games } from "./components/Games";
import { Hackathons } from "./components/Hackathons";
import { HackathonPage } from "./components/Hackathon";
import { Articles } from "./components/Articles";
import { Community } from "./components/Community";
import { Footer } from "./components/Footer";
import "./styles/app.css";

const HomePage: React.FC = () => (
  <>
    <Hero />
    <Community />
    <About />
    <Games />
    <Hackathons />
    <Articles />
  </>
);

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hackathons/:slug" element={<HackathonPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;