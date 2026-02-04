import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram, MapPin, Clock, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '(81) 98412-0292',
      link: 'https://wa.me/5581984120292',
      description: 'Nosso canal principal de atendimento'
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@paula.veigacakes',
      link: 'https://www.instagram.com/paula.veigacakes/',
      description: 'Acompanhe nossas criações'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Recife, Pernambuco',
      link: null,
      description: 'Atendemos toda a região metropolitana'
    },
    {
      icon: Clock,
      title: 'Horário',
      value: 'Seg - Sáb: 9h - 18h',
      link: null,
      description: 'Horário de atendimento'
    }
  ];

  return (
    <div className="min-h-screen bg-paula-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-paula-pink-light/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-paula-brown-dark mb-4"
          >
            Entre em <span className="text-paula-accent">Contato</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-paula-brown font-body text-lg max-w-2xl mx-auto"
          >
            Estamos prontos para transformar sua ideia em um bolo dos sonhos
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow border border-pink-100"
              >
                <div className="w-16 h-16 bg-paula-pink-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <info.icon className="text-paula-accent" size={28} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-paula-brown-dark mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paula-accent font-body font-medium hover:underline"
                    data-testid={`contact-${info.title.toLowerCase()}`}
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-paula-brown font-body font-medium">{info.value}</p>
                )}
                <p className="text-paula-brown/60 font-body text-sm mt-2">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-paula-pink-light to-paula-pink-medium/50 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-paula-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/50 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <MessageCircle className="text-white" size={40} />
              </div>
              
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-paula-brown-dark mb-4">
                Faça Seu Pedido pelo WhatsApp
              </h2>
              <p className="text-paula-brown font-body mb-8 max-w-xl mx-auto">
                Envie uma mensagem com os detalhes do seu evento e receba um orçamento 
                personalizado. Respondemos em até 2 horas!
              </p>
              
              <motion.a
                href="https://wa.me/5581984120292?text=Olá!%20Gostaria%20de%20fazer%20um%20orçamento%20para%20um%20bolo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex items-center gap-3 bg-[#25D366] text-white rounded-full px-10 py-5 font-bold text-lg shadow-2xl font-body"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 211, 102, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                data-testid="contact-whatsapp-cta"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                (81) 98412-0292
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-paula-pink-light/30">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl font-bold text-paula-brown-dark mb-4">
              Perguntas <span className="text-paula-accent">Frequentes</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'Qual a antecedência mínima para fazer um pedido?',
                a: 'Recomendamos um mínimo de 7 dias para bolos personalizados e 3 dias para bolos tradicionais. Para eventos grandes como casamentos, sugerimos 30 dias de antecedência.'
              },
              {
                q: 'Vocês fazem entrega?',
                a: 'Sim! Realizamos entregas em toda a região metropolitana do Recife. O valor da entrega varia de acordo com a localização.'
              },
              {
                q: 'Como funciona o pagamento?',
                a: 'Aceitamos PIX, cartão de débito/crédito e dinheiro. Para reservar a data, solicitamos um sinal de 50% do valor total.'
              },
              {
                q: 'Vocês fazem bolos para dietas restritivas?',
                a: 'Sim! Temos opções sem açúcar, sem glúten e sem lactose. Consulte-nos para verificar disponibilidade e valores.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100"
              >
                <h3 className="font-heading text-lg font-semibold text-paula-brown-dark mb-2">
                  {faq.q}
                </h3>
                <p className="text-paula-brown font-body">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
