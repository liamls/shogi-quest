import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Shogi from "./pages/Shogi";

function App() {
  useEffect(() => {
    document.title = "Shogi Quest";
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex justify-center items-center bg-gray-800 p-6">
              {/* Info Card */}

              <div className="bg-gray-900 shadow-lg rounded-lg p-8 max-w-md text-center border border-gray-700 m-6">
                <h1 className="text-5xl font-extrabold text-yellow-300 mb-4 tracking-widest">
                  SHOGI QUEST
                </h1>
                <p className="text-gray-300 mb-4 text-lg">
                  Le jeu d'échecs japonais où chaque mouvement compte !
                </p>

                <Link to="/shogi">
                  <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-500 transition duration-300 transform hover:scale-105 mb-4">
                    Démarrer
                  </button>
                </Link>
              </div>
              <div className="bg-gray-900 shadow-lg rounded-lg p-4 max-w-md text-left border border-gray-700 m-4">
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">
                  Info sur le Shogi
                </h2>
                <p className="text-gray-300 mb-2 text-sm">
                  Le Shogi est un jeu captivant qui allie stratégie et tactique.
                  Il est souvent comparé aux échecs, mais avec ses propres
                  règles uniques.
                </p>
                <p className="text-gray-300 mb-2 text-sm">
                  Chaque pièce a un rôle spécifique, et capturer les pièces
                  adverses est une partie essentielle de la stratégie du jeu.
                </p>
              </div>
            </div>
          }
        />
        <Route path="/shogi" element={<Shogi />} />
      </Routes>
    </Router>
  );
}

export default App;
