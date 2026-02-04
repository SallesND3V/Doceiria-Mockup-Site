import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-paula-brown-dark text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-bold mb-4">Paula Veiga</h3>
            <p className="text-pink-200 mb-6 font-body">
              Doçura em cada detalhe. Criamos bolos e doces artesanais com amor e dedicação para tornar seus momentos ainda mais especiais.
            </p>
            <a
              href="https://www.instagram.com/paula.veigacakes/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pink-200 hover:text-white transition-colors"
              data-testid="footer-instagram"
            >
              <Instagram size={20} />
              @paula.veigacakes
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">Links Rápidos</h4>
            <nav className="space-y-3 font-body">
              <Link to="/" className="block text-pink-200 hover:text-white transition-colors">Início</Link>
              <Link to="/galeria" className="block text-pink-200 hover:text-white transition-colors">Galeria</Link>
              <Link to="/sobre" className="block text-pink-200 hover:text-white transition-colors">Sobre</Link>
              <Link to="/contato" className="block text-pink-200 hover:text-white transition-colors">Contato</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">Contato</h4>
            <div className="space-y-3 font-body">
              <a 
                href="https://wa.me/5581984120292"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-pink-200 hover:text-white transition-colors"
                data-testid="footer-whatsapp"
              >
                <Phone size={18} />
                (81) 98412-0292
              </a>
              <div className="flex items-start gap-3 text-pink-200">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Recife, Pernambuco</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-paula-brown mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-pink-200/70 text-sm font-body">
            © {new Date().getFullYear()} Paula Veiga Doces. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-pink-200/70 text-sm font-body">
            Feito com <Heart size={14} className="text-paula-accent fill-paula-accent" /> em Recife
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
