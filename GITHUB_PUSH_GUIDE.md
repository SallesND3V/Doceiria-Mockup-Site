# 🚀 GUIA DE PUSH PARA GITHUB - Paula Veiga Doces

## ⚠️ Problema Encontrado

Erro ao fazer push:
```
remote: Permission to SallesND3V/Doceiria-Mockup-Site.git denied to HypeGen.
fatal: unable to access 'https://github.com/SallesND3V/Doceiria-Mockup-Site.git/': The requested URL returned error: 403
```

**Causa:** Problema de autenticação do Git com GitHub.

---

## ✅ SOLUÇÃO - Escolha UMA das opções:

### 🔑 Opção 1: GitHub CLI (RECOMENDADO - Mais fácil)

**Passo 1:** Instalar GitHub CLI
```powershell
winget install GitHub.cli
```

**Passo 2:** Fechar VS Code e abrir PowerShell novo

**Passo 3:** Autenticar
```powershell
gh auth login
```
Siga as instruções:
- Selecione: GitHub.com
- Selecione: HTTPS
- Selecione: Yes (para usar credenciais)
- Faça login pelo navegador

**Passo 4:** Fazer push
```powershell
cd "c:\Users\SallesN\Doceiria-Mockup-Site\Doceiria-Mockup-Site"
git push origin main
```

---

### 🔐 Opção 2: Personal Access Token (PAT)

**Passo 1:** Gerar Token no GitHub
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token"
3. Selecione escopos: `repo` e `workflow`
4. Clique em "Generate token"
5. **COPIE O TOKEN** (aparece só uma vez!)

**Passo 2:** Fazer push com o token
```powershell
cd "c:\Users\SallesN\Doceiria-Mockup-Site\Doceiria-Mockup-Site"
git push https://<SEU-TOKEN-AQUI>@github.com/SallesND3V/Doceiria-Mockup-Site.git main
```

Exemplo:
```powershell
git push https://ghp_1234567890abcdefghij@github.com/SallesND3V/Doceiria-Mockup-Site.git main
```

**Passo 3:** Armazenar credenciais (para não digitar toda vez)
```powershell
git config --global credential.helper wincred
git push origin main
# Será pedido o PAT como senha
```

---

### 🔑 Opção 3: SSH (Mais seguro, mas complexo)

**Passo 1:** Gerar chave SSH
```powershell
ssh-keygen -t ed25519 -C "seu@email.com"
# Pressione ENTER para tudo (sem senha)
```

**Passo 2:** Copiar chave pública
```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
# Chave foi copiada para clipboard
```

**Passo 3:** Adicionar ao GitHub
1. Acesse: https://github.com/settings/keys
2. Clique em "New SSH key"
3. Cole a chave (Ctrl+V)
4. Clique em "Add SSH key"

**Passo 4:** Alterar URL do repositório
```powershell
cd "c:\Users\SallesN\Doceiria-Mockup-Site\Doceiria-Mockup-Site"
git remote set-url origin git@github.com:SallesND3V/Doceiria-Mockup-Site.git
```

**Passo 5:** Fazer push
```powershell
git push origin main
```

---

## 📋 Checklist após Push bem-sucedido

- [ ] Verifique em https://github.com/SallesND3V/Doceiria-Mockup-Site
- [ ] Confirme que os arquivos foram atualizados
- [ ] Veja o commit mais recente
- [ ] Verifique o DEPLOY_GUIDE.md no GitHub

---

## 🎯 Próximos Passos (após push bem-sucedido)

### 1️⃣ Configurar Frontend (Vercel)

```bash
# Acesse: https://vercel.com
# - Clique em "Import Project"
# - Selecione seu repositório GitHub
# - Configure variável: REACT_APP_BACKEND_URL
# - Deploy automático!
```

### 2️⃣ Configurar Backend (Railway)

```bash
# Acesse: https://railway.app
# - Clique em "New Project"
# - Selecione "Deploy from GitHub"
# - Escolha a pasta "backend"
# - Configure variáveis de ambiente:
#   - MONGODB_URL
#   - CORS_ORIGINS
#   - JWT_SECRET
# - Deploy automático!
```

### 3️⃣ Configurar Banco de Dados (MongoDB Atlas)

```bash
# Acesse: https://cloud.mongodb.com
# - Crie um cluster gratuito
# - Obtenha a URL de conexão
# - Use em MONGODB_URL no Railway
```

---

## 🧪 Verificar Push

Após fazer push, verifique:

```powershell
# Ver commits recentes
git log --oneline -5

# Ver status
git status
# Deve mostrar: "Your branch is up to date with 'origin/main'."

# Ver arquivos no GitHub
git ls-remote --heads origin
```

---

## 🆘 Se ainda tiver problema

1. **Verifique seu user GitHub:**
   ```powershell
   git config --global user.name "SallesND3V"
   git config --global user.email "seu@email.com"
   ```

2. **Limpe credenciais antigas:**
   ```powershell
   git credential reject https://github.com
   ```

3. **Teste conexão:**
   ```powershell
   git remote -v
   # Deve mostrar a URL correta
   ```

4. **Verifique permissões:**
   - Acesse https://github.com/SallesND3V/Doceiria-Mockup-Site/settings
   - Verifique em "Collaborators" suas permissões

---

## 📞 Resumo Rápido

| Opção | Complexidade | Segurança | Recomendado |
|-------|-------------|----------|-------------|
| GitHub CLI | Fácil | Alta | ✅ SIM |
| PAT | Médio | Alta | ✅ SIM |
| SSH | Difícil | Muito Alta | Para experts |

---

**Status do Projeto:**
- ✅ Código pronto
- ✅ Documentação completa
- ⏳ Aguardando push para GitHub
- ⏳ Deploy automático

**Execute a Opção 1 (GitHub CLI) - é a mais fácil!**
