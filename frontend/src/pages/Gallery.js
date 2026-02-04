import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CakeCard from '@/components/CakeCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Gallery = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cakesRes, categoriesRes] = await Promise.all([
          axios.get(`${API}/cakes`),
          axios.get(`${API}/categories`)
        ]);
        setCakes(cakesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCakes = selectedCategory === 'all'
    ? cakes
    : cakes.filter(cake => cake.category_id === selectedCategory);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <div className="min-h-screen bg-paula-cream-light">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-paula-cream/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-paula-brown-dark mb-4"
          >
            Nossa <span className="text-paula-brown">Galeria</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-paula-brown font-body text-lg max-w-2xl mx-auto"
          >
            Explore nossas criações e encontre o bolo perfeito para sua ocasião especial
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white sticky top-20 z-30 border-b border-paula-cream-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter size={20} className="text-paula-brown flex-shrink-0" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-body font-medium transition-colors flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-paula-brown-dark text-white'
                  : 'bg-paula-cream text-paula-brown hover:bg-paula-cream-dark'
              }`}
              data-testid="filter-all"
            >
              Todos
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-body font-medium transition-colors flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-paula-brown-dark text-white'
                    : 'bg-paula-cream text-paula-brown hover:bg-paula-cream-dark'
                }`}
                data-testid={`filter-${category.slug}`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paula-brown-dark"></div>
            </div>
          ) : filteredCakes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-paula-brown font-body text-lg">
                Nenhum bolo encontrado nesta categoria.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCakes.map((cake, index) => (
                  <motion.div
                    key={cake.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CakeCard cake={cake} onClick={setSelectedCake} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedCake} onOpenChange={() => setSelectedCake(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white">
          {selectedCake && (
            <div className="grid md:grid-cols-2">
              <div className="aspect-square">
                <img
                  src={selectedCake.image_url}
                  alt={selectedCake.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl text-paula-brown-dark">
                    {selectedCake.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2 mb-4">
                  <span className="inline-block bg-paula-cream text-paula-brown px-3 py-1 rounded-full text-sm font-body">
                    {getCategoryName(selectedCake.category_id)}
                  </span>
                </div>
                <p className="text-paula-brown font-body flex-grow">
                  {selectedCake.description}
                </p>
                <div className="mt-6">
                  <p className="text-paula-brown-dark font-semibold font-body mb-4">
                    Consulte valores pelo WhatsApp
                  </p>
                  <motion.a
                    href={`https://wa.me/558196679522?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre: ${selectedCake.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine block text-center bg-paula-brown-dark hover:bg-paula-brown text-white rounded-full px-8 py-4 font-semibold transition-colors font-body"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="lightbox-order-btn"
                  >
                    Falar pelo WhatsApp
                  </motion.a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
