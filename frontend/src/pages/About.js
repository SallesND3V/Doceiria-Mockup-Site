import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Clock, Sparkles, Instagram } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const INSTAGRAM_PROFILE_URL = "https://instagram.com/paula.veigacakes";
const DEFAULT_LOGO = "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjk4MmE2OThiM2E4ODE5MWE0MTdkNWU0NWU2OTMwYzY6ZmlsZV8wMDAwMDAwMDRkZDA3MWY1OTJkZjc3N2RhOGFmNzBjZSIsInRzIjoiMjA0ODgiLCJwIjoicHlpIiwiY2lkIjoiMSIsInNpZyI6IjkxZWEyYWY2NGI2OTNiZjY2N2U2ZmIzMzRiZTk4YzA4YjQ2NzNkNjAwMGEyMzBkNGI4YzFhZGU1MmRhYTZiMzUiLCJ2IjoiMCIsImdpem1vX2lkIjpudWxsLCJjcyI6bnVsbCwiY3AiOm51bGwsIm1hIjpudWxsfQ==";

const About = () => {
  const [settings, setSettings] = useState({ logo_url: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API}/settings`);
        setSettings(response.data || {});
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const logoUrl = settings.logo_url || DEFAULT_LOGO;

  const values = [
    {
      icon: Heart,
      title: 'Amor em Cada Detalhe',
      description: 'Cada criação é feita com carinho e dedicação, como se fosse para nossa própria família.'
    },
    {
      icon: Award,
      title: 'Qualidade Premium',
      description: 'Utilizamos apenas ingredientes selecionados e de alta qualidade em todas as receitas.'
    },
    {
      icon: Clock,
      title: 'Compromisso com Prazos',
      description: 'Entregamos sempre no horário combinado, garantindo a perfeição do seu evento.'
    },
    {
      icon: Sparkles,
      title: 'Criatividade Única',
      description: 'Cada bolo é uma obra de arte personalizada, criada especialmente para você.'
    }
  ];

  return (
    <div className="min-h-screen bg-paula-cream-light">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 bg-paula-cream/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 right-20 w-72 h-72 bg-paula-cream-dark/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-paula-brown-dark mb-6">
                Sobre a <span className="text-paula-brown">Paula Veiga</span>
              </h1>
              <p className="text-paula-brown font-body text-lg mb-6 leading-relaxed">
                A Paula Veiga Doces nasceu de uma paixão que começou ainda na infância, 
                quando os primeiros bolos eram feitos na cozinha da vovó. Hoje, essa 
                paixão se transformou em uma confeitaria artesanal que encanta clientes 
                em todo o Recife e região.
              </p>
              <p className="text-paula-brown font-body leading-relaxed">
                Com mais de uma década de experiência, Paula combina técnicas tradicionais 
                de confeitaria com tendências modernas, criando bolos que são verdadeiras 
                obras de arte. Cada criação carrega consigo não apenas sabor excepcional, 
                mas também a história e o carinho de quem faz o que ama.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-paula-brown/10 rounded-full blur-2xl" />
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-paula-cream-dark shadow-2xl">
                  <img
                    src={logoUrl}
                    alt="Paula Veiga Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-paula-brown-dark mb-4">
              Nossos <span className="text-paula-brown">Valores</span>
            </h2>
            <p className="text-paula-brown font-body max-w-2xl mx-auto">
              O que nos diferencia e guia cada criação
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-paula-cream/30 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-paula-brown/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-paula-brown-dark" size={32} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-paula-brown-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-paula-brown font-body text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-paula-cream/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-paula-brown-dark mb-6">
                Nossa <span className="text-paula-brown">Missão</span>
              </h2>
              <p className="text-paula-brown font-body text-lg mb-6 leading-relaxed">
                Transformar momentos especiais em memórias doces e inesquecíveis. 
                Acreditamos que um bolo bem feito não é apenas uma sobremesa, é uma 
                peça central que reúne pessoas, celebra conquistas e eterniza momentos.
              </p>
              <p className="text-paula-brown font-body leading-relaxed mb-8">
                Cada bolo que sai de nossa cozinha carrega consigo a responsabilidade 
                de fazer parte de histórias de amor, aniversários inesquecíveis, casamentos 
                dos sonhos e todas as celebrações que marcam a vida das pessoas.
              </p>
              
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-4xl font-heading font-bold text-paula-brown-dark">10+</p>
                  <p className="text-paula-brown font-body">Anos de experiência</p>
                </div>
                <div>
                  <p className="text-4xl font-heading font-bold text-paula-brown-dark">500+</p>
                  <p className="text-paula-brown font-body">Clientes satisfeitos</p>
                </div>
                <div>
                  <p className="text-4xl font-heading font-bold text-paula-brown-dark">1000+</p>
                  <p className="text-paula-brown font-body">Bolos criados</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
                  alt="Bolo de chocolate"
                  className="rounded-2xl shadow-lg w-full aspect-square object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400"
                  alt="Bolo de casamento"
                  className="rounded-2xl shadow-lg w-full aspect-square object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400"
                  alt="Naked cake"
                  className="rounded-2xl shadow-lg w-full aspect-square object-cover -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
                  alt="Bolo de morango"
                  className="rounded-2xl shadow-lg w-full aspect-square object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-paula-brown-dark text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
              Vamos Criar Juntos?
            </h2>
            <p className="text-paula-cream font-body mb-8 text-lg">
              Entre em contato e conte-nos sobre sua ocasião especial. 
              Será um prazer fazer parte do seu momento!
            </p>
            <motion.a
              href="https://wa.me/558196679522?text=Olá!%20Gostaria%20de%20conhecer%20mais%20sobre%20os%20bolos%20da%20Paula%20Veiga"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-3 bg-paula-cream text-paula-brown-dark hover:bg-white rounded-full px-10 py-5 font-bold text-lg shadow-2xl transition-colors font-body"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="about-cta"
            >
              Falar com a Paula
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
