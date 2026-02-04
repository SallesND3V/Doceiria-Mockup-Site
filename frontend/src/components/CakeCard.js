import React from 'react';
import { motion } from 'framer-motion';

export const CakeCard = ({ cake, onClick, showPrice = false }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-paula-cream-dark cursor-pointer"
      whileHover={{ y: -8 }}
      onClick={() => onClick && onClick(cake)}
      data-testid={`cake-card-${cake.id}`}
    >
      <div className="img-hover-zoom aspect-square relative">
        <img
          src={cake.image_url}
          alt={cake.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {cake.featured && (
          <span className="absolute top-4 right-4 bg-paula-brown-dark text-white text-xs font-semibold px-3 py-1 rounded-full">
            Destaque
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-semibold text-paula-brown-dark mb-2 group-hover:text-paula-brown transition-colors">
          {cake.name}
        </h3>
        <p className="text-paula-brown/70 text-sm mb-3 line-clamp-2 font-body">
          {cake.description}
        </p>
        <div className="flex items-center justify-end">
          <motion.button
            className="bg-paula-cream text-paula-brown-dark px-4 py-2 rounded-full text-sm font-medium hover:bg-paula-brown-dark hover:text-white transition-colors font-body"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre: ${cake.name}`);
              window.open(`https://wa.me/5581984120292?text=${message}`, '_blank');
            }}
            data-testid={`order-btn-${cake.id}`}
          >
            Saiba mais
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CakeCard;
