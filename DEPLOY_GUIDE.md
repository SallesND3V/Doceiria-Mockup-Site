# Deploy & Push Guide para GitHub

## Erro de Autenticação - Soluções

### Opção 1: Usar Personal Access Token (PAT)

1. **Gere um PAT no GitHub:**
   - Vá em: https://github.com/settings/tokens
   - Clique em "Generate new token"
   - Selecione escopos: `repo`, `workflow`
   - Copie o token gerado

2. **Configure Git para usar o PAT:**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

3. **Faça push usando o PAT:**
```bash
# Windows
git push https://<seu-PAT>@github.com/SallesND3V/Doceiria-Mockup-Site.git main

# Ou armazene as credenciais
git config --global credential.helper wincred
git push origin main
# (será solicitado o PAT como senha)
```

### Opção 2: Usar SSH

1. **Gere chave SSH:**
```bash
ssh-keygen -t ed25519 -C "seu@email.com"
```

2. **Adicione a chave ao GitHub:**
   - Copie o conteúdo de `~/.ssh/id_ed25519.pub`
   - Vá em: https://github.com/settings/keys
   - Clique em "New SSH key"
   - Cole a chave

3. **Configure Git para usar SSH:**
```bash
git remote set-url origin git@github.com:SallesND3V/Doceiria-Mockup-Site.git
git push origin main
```

### Opção 3: GitHub CLI

1. **Instale GitHub CLI:**
```bash
winget install GitHub.cli
```

2. **Autentique:**
```bash
gh auth login
# Siga as instruções
```

3. **Faça push:**
```bash
git push origin main
```

## Após Push bem-sucedido

1. **Verifique no GitHub:**
   - Vá em: https://github.com/SallesND3V/Doceiria-Mockup-Site
   - Confirme que os arquivos foram atualizados

2. **Configure Deploy Automático:**

### Para Vercel (Frontend):
- Conecte seu repositório GitHub
- Configure `REACT_APP_BACKEND_URL`
- Deploy automático a cada push

### Para Railway (Backend):
- Conecte seu repositório GitHub
- Configure variáveis de ambiente
- Deploy automático a cada push

## Variáveis de Ambiente Necessárias para Produção

### Backend (Railway/Heroku/VPS)
```env
MONGODB_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/paula_veiga_doces
CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
JWT_SECRET=gerar-uma-chave-muito-segura-aqui
DEBUG=False
```

### Frontend (Vercel)
```env
REACT_APP_BACKEND_URL=https://seu-backend-api.com
```

## Próximos Passos

1. ✅ Fazer push do código (solucionar erro de autenticação acima)
2. ⏳ Configurar Frontend no Vercel
3. ⏳ Configurar Backend no Railway
4. ⏳ Conectar MongoDB Atlas
5. ⏳ Configurar domínio personalizado
6. ⏳ Testar fluxo completo

## Suporte Técnico

Se encontrar problemas:
- Verifique permissões no GitHub
- Confirme autenticação (PAT/SSH)
- Valide variáveis de ambiente
- Veja logs do deploy na plataforma
