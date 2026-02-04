import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Cake, FolderOpen, MessageSquare, LogOut, Menu, X, Plus, Pencil, Trash2, Upload, Star, Home, Settings, Instagram, RefreshCw, ExternalLink, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/cakes', icon: Cake, label: 'Bolos' },
    { path: '/admin/categories', icon: FolderOpen, label: 'Categorias' },
    { path: '/admin/testimonials', icon: MessageSquare, label: 'Depoimentos' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-pink-100 z-50
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-pink-100">
          <h1 className="font-heading text-2xl font-bold text-paula-brown-dark">Paula Veiga</h1>
          <p className="text-paula-brown/60 text-sm font-body">Painel Admin</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body transition-colors ${
                location.pathname === item.path
                  ? 'bg-paula-pink-light text-paula-accent font-medium'
                  : 'text-paula-brown hover:bg-paula-pink-light/50'
              }`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-pink-100">
          <div className="mb-4 px-4">
            <p className="font-body font-medium text-paula-brown-dark">{user?.name}</p>
            <p className="text-sm text-paula-brown/60 font-body">{user?.email}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-paula-brown hover:bg-paula-pink-light/50 transition-colors mb-2"
          >
            <Home size={20} />
            Ver Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-red-500 hover:bg-red-50 transition-colors w-full"
            data-testid="logout-btn"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const [stats, setStats] = useState({ cakes: 0, categories: 0, testimonials: 0 });
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/stats`, { headers: getAuthHeaders() });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [getAuthHeaders]);

  const statCards = [
    { title: 'Bolos', value: stats.cakes, icon: Cake, color: 'bg-pink-100 text-pink-600' },
    { title: 'Categorias', value: stats.categories, icon: FolderOpen, color: 'bg-amber-100 text-amber-600' },
    { title: 'Depoimentos', value: stats.testimonials, icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-paula-brown-dark mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-pink-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium font-body text-paula-brown">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold text-paula-brown-dark">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Cakes Page
const CakesPage = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category_id: '', image_url: '', featured: false
  });
  const { getAuthHeaders } = useAuth();

  const fetchData = async () => {
    try {
      const [cakesRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/cakes`),
        axios.get(`${API}/categories`)
      ]);
      setCakes(cakesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/upload`, formDataUpload, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image_url: response.data.url });
      toast.success('Imagem carregada!');
    } catch (error) {
      toast.error('Erro ao carregar imagem');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, price: parseFloat(formData.price) };
      if (editingCake) {
        await axios.put(`${API}/cakes/${editingCake.id}`, data, { headers: getAuthHeaders() });
        toast.success('Bolo atualizado!');
      } else {
        await axios.post(`${API}/cakes`, data, { headers: getAuthHeaders() });
        toast.success('Bolo adicionado!');
      }
      setDialogOpen(false);
      setEditingCake(null);
      setFormData({ name: '', description: '', price: '', category_id: '', image_url: '', featured: false });
      fetchData();
    } catch (error) {
      toast.error('Erro ao salvar bolo');
    }
  };

  const handleEdit = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      description: cake.description,
      price: cake.price.toString(),
      category_id: cake.category_id,
      image_url: cake.image_url,
      featured: cake.featured
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este bolo?')) return;
    try {
      await axios.delete(`${API}/cakes/${id}`, { headers: getAuthHeaders() });
      toast.success('Bolo removido!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao remover bolo');
    }
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || '';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-paula-brown-dark">Bolos</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingCake(null);
            setFormData({ name: '', description: '', price: '', category_id: '', image_url: '', featured: false });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-paula-accent hover:bg-pink-700" data-testid="add-cake-btn">
              <Plus size={20} className="mr-2" /> Adicionar Bolo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                {editingCake ? 'Editar Bolo' : 'Novo Bolo'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">Nome</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="cake-name-input"
                  />
                </div>
                <div>
                  <Label className="font-body">Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    data-testid="cake-price-input"
                  />
                </div>
              </div>
              <div>
                <Label className="font-body">Categoria</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger data-testid="cake-category-select">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body">Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  data-testid="cake-description-input"
                />
              </div>
              <div>
                <Label className="font-body">Imagem</Label>
                <div className="mt-2 flex items-center gap-4">
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-paula-pink-light rounded-lg cursor-pointer hover:bg-paula-pink-medium transition-colors">
                    <Upload size={18} />
                    <span className="font-body">Carregar imagem</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <Input
                  className="mt-2"
                  placeholder="Ou cole a URL da imagem"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  data-testid="cake-image-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  data-testid="cake-featured-switch"
                />
                <Label className="font-body">Destacar na página inicial</Label>
              </div>
              <Button type="submit" className="w-full bg-paula-accent hover:bg-pink-700" data-testid="save-cake-btn">
                {editingCake ? 'Salvar Alterações' : 'Adicionar Bolo'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-paula-accent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Imagem</TableHead>
                <TableHead className="font-body">Nome</TableHead>
                <TableHead className="font-body">Categoria</TableHead>
                <TableHead className="font-body">Preço</TableHead>
                <TableHead className="font-body">Destaque</TableHead>
                <TableHead className="font-body">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cakes.map((cake) => (
                <TableRow key={cake.id}>
                  <TableCell>
                    <img src={cake.image_url} alt={cake.name} className="w-12 h-12 object-cover rounded-lg" />
                  </TableCell>
                  <TableCell className="font-body font-medium">{cake.name}</TableCell>
                  <TableCell className="font-body">{getCategoryName(cake.category_id)}</TableCell>
                  <TableCell className="font-body">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cake.price)}
                  </TableCell>
                  <TableCell>
                    {cake.featured && <Star size={18} className="text-amber-500 fill-amber-500" />}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(cake)} data-testid={`edit-cake-${cake.id}`}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(cake.id)} data-testid={`delete-cake-${cake.id}`}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// Categories Page
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const { getAuthHeaders } = useAuth();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/categories`, formData, { headers: getAuthHeaders() });
      toast.success('Categoria adicionada!');
      setDialogOpen(false);
      setFormData({ name: '', slug: '' });
      fetchData();
    } catch (error) {
      toast.error('Erro ao adicionar categoria');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`, { headers: getAuthHeaders() });
      toast.success('Categoria removida!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao remover categoria');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-paula-brown-dark">Categorias</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-paula-accent hover:bg-pink-700" data-testid="add-category-btn">
              <Plus size={20} className="mr-2" /> Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Nova Categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label className="font-body">Nome</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ 
                    name: e.target.value, 
                    slug: generateSlug(e.target.value) 
                  })}
                  required
                  data-testid="category-name-input"
                />
              </div>
              <div>
                <Label className="font-body">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  data-testid="category-slug-input"
                />
              </div>
              <Button type="submit" className="w-full bg-paula-accent hover:bg-pink-700" data-testid="save-category-btn">
                Adicionar Categoria
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-paula-accent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Nome</TableHead>
                <TableHead className="font-body">Slug</TableHead>
                <TableHead className="font-body">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-body font-medium">{cat.name}</TableCell>
                  <TableCell className="font-body text-paula-brown/60">{cat.slug}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(cat.id)} data-testid={`delete-category-${cat.id}`}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// Testimonials Page
const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ author_name: '', content: '', rating: 5 });
  const { getAuthHeaders } = useAuth();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      toast.error('Erro ao carregar depoimentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/testimonials`, formData, { headers: getAuthHeaders() });
      toast.success('Depoimento adicionado!');
      setDialogOpen(false);
      setFormData({ author_name: '', content: '', rating: 5 });
      fetchData();
    } catch (error) {
      toast.error('Erro ao adicionar depoimento');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este depoimento?')) return;
    try {
      await axios.delete(`${API}/testimonials/${id}`, { headers: getAuthHeaders() });
      toast.success('Depoimento removido!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao remover depoimento');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-paula-brown-dark">Depoimentos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-paula-accent hover:bg-pink-700" data-testid="add-testimonial-btn">
              <Plus size={20} className="mr-2" /> Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Novo Depoimento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label className="font-body">Nome do Cliente</Label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  required
                  data-testid="testimonial-name-input"
                />
              </div>
              <div>
                <Label className="font-body">Depoimento</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                  data-testid="testimonial-content-input"
                />
              </div>
              <div>
                <Label className="font-body">Avaliação</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger data-testid="testimonial-rating-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n} estrelas</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-paula-accent hover:bg-pink-700" data-testid="save-testimonial-btn">
                Adicionar Depoimento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-paula-accent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-pink-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Cliente</TableHead>
                <TableHead className="font-body">Depoimento</TableHead>
                <TableHead className="font-body">Avaliação</TableHead>
                <TableHead className="font-body">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-body font-medium">{t.author_name}</TableCell>
                  <TableCell className="font-body max-w-md truncate">{t.content}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(t.id)} data-testid={`delete-testimonial-${t.id}`}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paula-cream">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-pink-100 z-30 flex items-center px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2" data-testid="mobile-sidebar-toggle">
          <Menu size={24} className="text-paula-brown-dark" />
        </button>
        <h1 className="font-heading text-xl font-bold text-paula-brown-dark ml-4">Paula Veiga</h1>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 p-6 lg:p-8">
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="cakes" element={<CakesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
