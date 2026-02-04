import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '558196679522';
  const message = encodeURIComponent('Olá! Gostaria de fazer um pedido na Paula Veiga Doces.');
  
  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-pulse-glow hover:scale-110 transition-transform"
      data-testid="whatsapp-floating-btn"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={28} fill="white" />
      <span className="hidden md:inline font-semibold">Peça pelo WhatsApp</span>
    </motion.a>
  );
};

export default WhatsAppButton;
