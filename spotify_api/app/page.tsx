// pages/index.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mon Projet</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#features" className="hover:text-blue-500">Features</a></li>
              <li><a href="#about" className="hover:text-blue-500">About</a></li>
              <li><a href="#contact" className="hover:text-blue-500">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Bienvenue sur Mon Projet</h2>
          <p className="text-lg mb-6">Créez des expériences modernes et performantes avec Next.js et Tailwind CSS.</p>
          <button className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow hover:bg-gray-200">
            Commencez Maintenant
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Fonctionnalités</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-bold mb-2">Rapidité</h4>
              <p>Optimisé pour des performances maximales.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-bold mb-2">Flexibilité</h4>
              <p>Personnalisez facilement chaque composant.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-bold mb-2">Scalabilité</h4>
              <p>Conçu pour évoluer avec vos besoins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          &copy; 2025 Mon Projet. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default Home;
