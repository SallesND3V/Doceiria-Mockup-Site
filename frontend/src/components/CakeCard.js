import React from 'react';
import { motion } from 'framer-motion';

export const CakeCard = ({ cake, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-pink-100 cursor-pointer"
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
          <span className="absolute top-4 right-4 bg-paula-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
            Destaque
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-semibold text-paula-brown-dark mb-2 group-hover:text-paula-accent transition-colors">
          {cake.name}
        </h3>
        <p className="text-paula-brown/70 text-sm mb-3 line-clamp-2 font-body">
          {cake.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-paula-accent font-bold text-lg font-body">
            {formatPrice(cake.price)}
          </span>
          <motion.button
            className="bg-paula-pink-light text-paula-brown-dark px-4 py-2 rounded-full text-sm font-medium hover:bg-paula-accent hover:text-white transition-colors font-body"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              const message = encodeURIComponent(`Olá! Gostaria de encomendar o ${cake.name}`);
              window.open(`https://wa.me/5581984120292?text=${message}`, '_blank');
            }}
            data-testid={`order-btn-${cake.id}`}
          >
            Encomendar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CakeCard;
