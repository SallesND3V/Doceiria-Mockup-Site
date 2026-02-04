import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CakeCard from '@/components/CakeCard';
import TestimonialCard from '@/components/TestimonialCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Default images
const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600";

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({ hero_image_url: '', logo_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed data first
        await axios.post(`${API}/seed`).catch(() => {});
        
        const [cakesRes, testimonialsRes, settingsRes] = await Promise.all([
          axios.get(`${API}/cakes?featured=true`),
          axios.get(`${API}/testimonials`),
          axios.get(`${API}/settings`).catch(() => ({ data: {} }))
        ]);
        setFeaturedCakes(cakesRes.data.slice(0, 4));
        setTestimonials(testimonialsRes.data);
        setSettings(settingsRes.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroImage = settings.hero_image_url || DEFAULT_HERO_IMAGE;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-paula-cream-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-paula-cream/50 via-white/30 to-paula-cream-light" />
          <motion.div 
            className="absolute top-20 right-10 w-72 h-72 bg-paula-cream-dark/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-10 w-96 h-96 bg-paula-cream/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-paula-cream-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={16} className="text-paula-brown-dark" />
                <span className="text-sm font-body text-paula-brown">Doces Artesanais em Recife</span>
              </motion.div>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-paula-brown-dark leading-tight mb-6">
                Doçura em{' '}
                <span className="text-paula-brown">Cada</span>{' '}
                Detalhe
              </h1>
              
              <p className="text-lg text-paula-brown font-body mb-8 max-w-lg">
                Transformamos seus momentos especiais em memórias doces e inesquecíveis. 
                Bolos artesanais feitos com amor e os melhores ingredientes.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="https://wa.me/5581984120292?text=Olá!%20Gostaria%20de%20fazer%20uma%20encomenda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine bg-paula-brown-dark hover:bg-paula-brown text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 shadow-lg transition-all font-body"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(61, 41, 20, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="hero-cta-whatsapp"
                >
                  Fazer Pedido
                  <ArrowRight size={20} />
                </motion.a>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/galeria"
                    className="border-2 border-paula-brown-dark text-paula-brown-dark hover:bg-paula-brown-dark hover:text-white rounded-full px-8 py-4 font-semibold inline-block transition-colors font-body"
                    data-testid="hero-cta-gallery"
                  >
                    Ver Galeria
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div 
                  className="absolute -inset-4 bg-gradient-to-br from-paula-cream-dark to-paula-brown rounded-3xl opacity-20 blur-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <img
                  src={heroImage}
                  alt="Bolo artesanal Paula Veiga"
                  className="relative rounded-3xl shadow-2xl w-full object-cover aspect-square"
                />
              </div>
              
              {/* Floating badges */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-paula-cream-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-3xl font-heading font-bold text-paula-brown-dark">500+</p>
                <p className="text-sm text-paula-brown font-body">Clientes Felizes</p>
              </motion.div>
              
              <motion.div
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-paula-cream-dark"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-3xl font-heading font-bold text-paula-brown-dark">5★</p>
                <p className="text-sm text-paula-brown font-body">Avaliação</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-paula-brown-dark mb-4">
              Nossos <span className="text-paula-brown">Destaques</span>
            </h2>
            <p className="text-paula-brown font-body max-w-2xl mx-auto">
              Conheça alguns dos nossos bolos mais amados pelos clientes
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paula-brown-dark"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredCakes.map((cake) => (
                <motion.div key={cake.id} variants={itemVariants}>
                  <CakeCard cake={cake} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/galeria"
              className="inline-flex items-center gap-2 text-paula-brown-dark font-semibold hover:gap-4 transition-all font-body"
              data-testid="see-all-cakes-link"
            >
              Ver todos os bolos <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-24 bg-paula-cream/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-paula-brown/10 rounded-3xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=600"
                alt="Confeitaria artesanal"
                className="relative rounded-3xl shadow-xl w-full object-cover aspect-[4/5]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-paula-brown-dark mb-6">
                Sobre a <span className="text-paula-brown">Paula Veiga</span>
              </h2>
              <p className="text-paula-brown font-body mb-6 text-lg leading-relaxed">
                Com mais de 10 anos de experiência em confeitaria artesanal, a Paula Veiga 
                transforma ingredientes selecionados em verdadeiras obras de arte comestíveis.
              </p>
              <p className="text-paula-brown font-body mb-8 leading-relaxed">
                Cada bolo é criado com dedicação, amor e atenção aos mínimos detalhes, 
                garantindo não apenas um visual deslumbrante, mas também um sabor incomparável.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-2 bg-paula-brown-dark text-white rounded-full px-8 py-4 font-semibold hover:bg-paula-brown transition-colors font-body"
                  data-testid="about-link"
                >
                  Conheça Nossa História <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-paula-brown-dark mb-4">
              O Que Dizem <span className="text-paula-brown">Nossos Clientes</span>
            </h2>
            <p className="text-paula-brown font-body max-w-2xl mx-auto">
              A satisfação de nossos clientes é nossa maior recompensa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 bg-paula-cream/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-paula-brown-dark mb-4">
              Siga no <span className="text-paula-brown">Instagram</span>
            </h2>
            <p className="text-paula-brown font-body mb-8">
              Acompanhe nossos lançamentos e criações exclusivas
            </p>
            <motion.a
              href="https://www.instagram.com/paula.veigacakes/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-full px-8 py-4 font-semibold shadow-lg font-body"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              data-testid="instagram-cta"
            >
              <Instagram size={24} />
              @paula.veigacakes
            </motion.a>
          </motion.div>

          {/* Instagram Grid Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
              "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400",
              "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
            ].map((img, i) => (
              <motion.a
                key={i}
                href="https://www.instagram.com/paula.veigacakes/"
                target="_blank"
                rel="noopener noreferrer"
                className="img-hover-zoom rounded-2xl overflow-hidden aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-paula-brown-dark text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-paula-brown/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-paula-cream/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
              Pronto para Adoçar seu <span className="text-paula-cream">Momento Especial</span>?
            </h2>
            <p className="text-paula-cream font-body mb-8 text-lg">
              Entre em contato pelo WhatsApp e solicite seu orçamento personalizado. 
              Estamos prontos para criar o bolo dos seus sonhos!
            </p>
            <motion.a
              href="https://wa.me/5581984120292?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-3 bg-[#25D366] text-white rounded-full px-10 py-5 font-bold text-lg shadow-2xl font-body"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="cta-whatsapp-bottom"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Solicitar Orçamento
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
