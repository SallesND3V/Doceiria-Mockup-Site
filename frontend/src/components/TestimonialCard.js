import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl border border-paula-cream-dark relative shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Quote className="absolute top-4 right-4 text-paula-cream-dark" size={32} />
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Content */}
      <p className="text-paula-brown font-body mb-6 italic">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-paula-cream flex items-center justify-center">
          <span className="font-heading text-paula-brown-dark text-xl">
            {testimonial.author_name.charAt(0)}
          </span>
        </div>
        <span className="font-heading font-semibold text-paula-brown-dark">
          {testimonial.author_name}
        </span>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
