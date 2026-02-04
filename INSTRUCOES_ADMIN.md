# Paula Veiga Doces - Guia do Administrador

## Acesso ao Painel Administrativo

**Link do Painel Admin:**
```
https://paula-veiga-doces.preview.emergentagent.com/admin/login
```

**Credenciais de Acesso:**
- **Email:** admin@paulaveiga.com
- **Senha:** senha123

---

## Como Sincronizar as Fotos do Instagram Automaticamente

Para que as fotos postadas no Instagram (@paula.veigacakes) apareçam automaticamente na galeria do site, siga este tutorial completo:

### Passo 1: Converter para Conta Business/Creator

1. Abra o **Instagram** no celular
2. Vá em **Configurações** → **Conta**
3. Toque em **Mudar para conta profissional**
4. Escolha **Business** (Empresa) ou **Creator** (Criador)
5. Conecte a uma **Página do Facebook** (crie uma se não tiver)
6. Complete as informações solicitadas

### Passo 2: Criar Aplicativo no Meta Developer Portal

1. Acesse: **https://developers.facebook.com**
2. Faça login com sua conta do Facebook
3. Clique em **Meus Apps** → **Criar App**
4. Selecione **Business** como tipo de app
5. Dê um nome (ex: "Paula Veiga Site")
6. Informe o email de contato
7. Clique em **Criar App**

### Passo 3: Configurar Instagram Graph API

1. No painel do app, vá em **Adicionar Produtos**
2. Encontre **Instagram** e clique em **Configurar**
3. Vá em **Configurações Básicas** e anote:
   - **App ID**
   - **App Secret** (clique em "Mostrar")

### Passo 4: Gerar Access Token

1. No menu lateral, vá em **Instagram** → **API Setup**
2. Clique em **Add or Remove Instagram Testers**
3. Adicione sua conta do Instagram como tester
4. Volte ao Instagram (celular) → **Configurações** → **Apps e sites** → **Tester invites** → Aceite o convite
5. Volte ao Developer Portal
6. Em **Instagram** → **API Setup**, clique em **Generate Token**
7. Selecione sua conta e autorize as permissões
8. **COPIE O TOKEN** - ele só aparece uma vez!

### Passo 5: Obter o Instagram User ID

1. Ainda no Developer Portal, vá em **Tools** → **Graph API Explorer**
2. No campo, digite: `me?fields=id,username`
3. Clique em **Submit**
4. Copie o **id** que aparece no resultado

### Passo 6: Configurar no Site Paula Veiga

1. Acesse o painel admin: https://paula-veiga-doces.preview.emergentagent.com/admin/login
2. Faça login com as credenciais acima
3. Vá em **Configurações** (menu lateral)
4. Na seção **Integração com Instagram**:
   - Cole o **Instagram User ID** no campo correspondente
   - Cole o **Access Token** no campo correspondente
5. Clique em **Salvar Configurações**
6. Clique em **Sincronizar Fotos do Instagram**

Pronto! As fotos do Instagram serão importadas para a galeria.

---

## Sincronização Automática

Após configurar, você pode clicar em **Sincronizar Fotos do Instagram** sempre que postar novas fotos no Instagram para importá-las para o site.

**Dica:** O token do Instagram expira após 60 dias. Quando expirar, será necessário gerar um novo token seguindo o Passo 4.

---

## Configurar Imagens do Site Manualmente

Enquanto não configura o Instagram, você pode adicionar fotos manualmente:

### Definir Logo e Imagem Principal

1. Acesse **Configurações** no painel admin
2. Em **URL da Logo**: cole o link da sua logo ou foto de perfil
3. Em **URL da Imagem Principal (Hero)**: cole o link da imagem que aparece na página inicial
4. Clique em **Salvar Configurações**

### Adicionar Bolos à Galeria

1. Vá em **Bolos** no menu lateral
2. Clique em **Adicionar Bolo**
3. Preencha:
   - Nome do bolo
   - Descrição
   - Categoria
   - URL da imagem (pode ser do Instagram)
4. Marque **Destacar na página inicial** se quiser que apareça na home
5. Clique em **Adicionar Bolo**

### Como Pegar URL de Imagem do Instagram

1. Abra o Instagram no **computador** (instagram.com)
2. Vá até a foto desejada
3. Clique com o **botão direito** na imagem
4. Selecione **Copiar endereço da imagem**
5. Cole no campo de imagem no painel admin

---

## Funcionalidades do Painel Admin

| Seção | O que faz |
|-------|-----------|
| **Dashboard** | Visão geral com estatísticas |
| **Bolos** | Adicionar, editar e remover bolos da galeria |
| **Categorias** | Gerenciar categorias (Aniversário, Casamento, etc.) |
| **Depoimentos** | Adicionar avaliações de clientes |
| **Configurações** | Logo, imagem principal e integração Instagram |

---

## Contato WhatsApp

O site está configurado para direcionar pedidos para:
**WhatsApp:** (81) 9667-9522

---

## Links Úteis

- **Site:** https://paula-veiga-doces.preview.emergentagent.com
- **Painel Admin:** https://paula-veiga-doces.preview.emergentagent.com/admin/login
- **Instagram:** https://instagram.com/paula.veigacakes
- **Meta Developer Portal:** https://developers.facebook.com

---

## Suporte

Se tiver dúvidas sobre a configuração, entre em contato com o desenvolvedor.
