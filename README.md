# Paula Veiga Doces - Site Oficial

Um site moderno e responsivo para confeitaria Paula Veiga Doces, desenvolvido com React (frontend) e FastAPI (backend), com MongoDB para persistência de dados.

## 📋 Funcionalidades

- 🎂 Catálogo dinâmico de bolos
- 📸 Galeria de fotos
- 💬 Depoimentos de clientes
- 👨‍💼 Painel administrativo para gerenciamento de conteúdo
- 📱 WhatsApp integrado para pedidos
- 🔐 Autenticação segura com JWT
- 📊 Dashboard com estatísticas
- 🎨 Design responsivo e moderno

## 🚀 Inicio Rápido (Desenvolvimento Local)

### Pré-requisitos

- Python 3.8+
- Node.js 14+
- MongoDB 4.0+
- Git

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/Paula-Veiga-Doces.git
cd Paula-Veiga-Doces
```

2. **Configure o Backend:**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

3. **Configure o Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
```

4. **Configure as Variáveis de Ambiente:**

Copie o arquivo `.env.example` para `.env` em cada diretório:

**Backend (`backend/.env`):**
```env
MONGODB_URL=mongodb://localhost:27017/paula_veiga_doces
CORS_ORIGINS=http://localhost:3000,http://localhost:3004
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

5. **Inicie o MongoDB:**
```bash
# Windows (se instalado via winget)
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

6. **Inicie o Backend:**
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

7. **Inicie o Frontend (em outro terminal):**
```bash
cd frontend
npm start
```

Acesse `http://localhost:3000` no navegador.

## 📦 Deployment em Produção

### Variáveis de Ambiente Necessárias

#### Backend (`backend/.env`)
```env
MONGODB_URL=mongodb://seu-usuario:sua-senha@seu-host:27017/paula_veiga_doces
CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
JWT_SECRET=sua-chave-secreta-forte
```

#### Frontend (`frontend/.env.production`)
```env
REACT_APP_BACKEND_URL=https://seu-backend-api.com
```

### Opção 1: Vercel (Frontend) + Railway (Backend)

**Backend (Railway):**
1. Faça push do código para GitHub
2. Conecte seu repositório no Railway
3. Configure as variáveis de ambiente
4. Deploy automático

**Frontend (Vercel):**
1. Importe o repositório no Vercel
2. Configure `REACT_APP_BACKEND_URL` com sua URL do Railway
3. Deploy automático ao fazer push

### Opção 2: Heroku

1. **Instale o Heroku CLI**
2. **Crie dois apps:**
```bash
heroku login
heroku create seu-backend-app
heroku create seu-frontend-app

# Configure MongoDB (adicione add-on)
heroku addons:create mongolab:sandbox -a seu-backend-app
```

3. **Deploy Backend:**
```bash
cd backend
heroku git:remote -a seu-backend-app
git push heroku main
```

4. **Deploy Frontend:**
```bash
cd frontend
npm run build
# Use buildpack customizado ou integração com Vercel
```

### Opção 3: Docker

```bash
# Build e run do backend
cd backend
docker build -t paula-backend .
docker run -p 8000:8000 -e MONGODB_URL=sua_url paula-backend

# Build e run do frontend
cd frontend
docker build -t paula-frontend .
docker run -p 3000:3000 -e REACT_APP_BACKEND_URL=http://seu-backend paula-frontend
```

## 🔐 Credenciais Padrão

**Email:** admin@paulaveiga.com  
**Senha:** senha123

⚠️ **IMPORTANTE:** Altere essas credenciais imediatamente em produção!

## 📝 Configuração Pós-Deploy

1. Acesse o painel admin em `https://seu-dominio.com/admin/login`
2. Altere a senha do administrador
3. Configure as imagens do site em **Configurações**
4. Adicione bolos à galeria em **Bolos**
5. Configure integração com Instagram (opcional)

## 🏗️ Estrutura do Projeto

```
Paula-Veiga-Doces/
├── backend/
│   ├── server.py           # Aplicação FastAPI
│   ├── requirements.txt     # Dependências Python
│   └── .env               # Variáveis (gitignored)
├── frontend/
│   ├── src/
│   │   ├── pages/         # Páginas
│   │   ├── components/    # Componentes
│   │   ├── contexts/      # Context API
│   │   └── lib/           # Utilitários
│   ├── public/            # Assets
│   └── package.json       # Dependências
├── .env.example          # Template de variáveis
├── .gitignore            # Arquivos ignorados
├── README.md             # Este arquivo
└── INSTRUCOES_ADMIN.md   # Guia do admin
```

## 🔄 Git Workflow

```bash
# Clonar
git clone <seu-repo>

# Fazer mudanças
git add .
git commit -m "Descrição clara"
git push origin main

# O deploy acontece automaticamente!
```

## 🛠️ Stack Tecnológico

**Frontend:**
- React 18
- Tailwind CSS
- Axios
- React Router
- Framer Motion

**Backend:**
- FastAPI
- Motor (Async MongoDB)
- PyJWT + Bcrypt
- Pydantic

**Database:**
- MongoDB (NoSQL)

## 📞 Contato e Suporte

**WhatsApp para Pedidos:** (81) 9667-9522  
**Instagram:** @paula.veigacakes

Para questões técnicas, consulte `INSTRUCOES_ADMIN.md`.

---

**Desenvolvido com ❤️ para Paula Veiga Doces**  
Última atualização: Fevereiro 2026
