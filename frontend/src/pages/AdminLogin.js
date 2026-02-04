import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      } else {
        await register(email, password, name);
        toast.success('Conta criada com sucesso!');
      }
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || 'Erro ao processar solicitação';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paula-cream-light flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-paula-cream-dark">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="font-heading text-3xl font-bold text-paula-brown-dark">
                Paula Veiga
              </h1>
            </Link>
            <p className="text-paula-brown font-body mt-2">
              Painel Administrativo
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 bg-paula-cream/50 rounded-full p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-full font-body font-medium transition-colors ${
                isLogin
                  ? 'bg-paula-brown-dark text-white'
                  : 'text-paula-brown hover:text-paula-brown-dark'
              }`}
              data-testid="login-tab"
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-full font-body font-medium transition-colors ${
                !isLogin
                  ? 'bg-paula-brown-dark text-white'
                  : 'text-paula-brown hover:text-paula-brown-dark'
              }`}
              data-testid="register-tab"
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-paula-brown font-body">
                  Nome
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-paula-brown/50" size={18} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-paula-cream-dark focus:border-paula-brown-dark"
                    placeholder="Seu nome"
                    required={!isLogin}
                    data-testid="name-input"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-paula-brown font-body">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-paula-brown/50" size={18} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-paula-cream-dark focus:border-paula-brown-dark"
                  placeholder="seu@email.com"
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-paula-brown font-body">
                Senha
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-paula-brown/50" size={18} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-paula-cream-dark focus:border-paula-brown-dark"
                  placeholder="••••••••"
                  required
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paula-brown/50 hover:text-paula-brown"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-paula-brown-dark hover:bg-paula-brown text-white font-body font-semibold py-6 rounded-full"
              data-testid="submit-btn"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-paula-brown font-body text-sm hover:text-paula-brown-dark transition-colors"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
