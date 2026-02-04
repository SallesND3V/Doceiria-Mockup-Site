# Paula Veiga Doces - PRD (Product Requirements Document)

## Problema Original
Site para doceria chamada Paula Veiga com:
- Paleta: rosa claro, branco e marrom
- Sistema de agendamento via WhatsApp (8196679522)
- Site profissional com efeitos e animações
- Painel admin para gerenciar fotos dos bolos
- Instagram: @paula.veigacakes

## Arquitetura
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + Motor (MongoDB async)
- **Database**: MongoDB
- **Auth**: JWT (PyJWT + bcrypt)

## User Personas
1. **Clientes**: Pessoas buscando bolos artesanais para eventos
2. **Admin (Paula)**: Dona da doceria que gerencia catálogo

## Core Requirements (Estático)
- [x] Landing page atraente com CTA para WhatsApp
- [x] Galeria de bolos com categorias
- [x] Sistema de autenticação admin
- [x] CRUD completo de bolos, categorias e depoimentos
- [x] Upload de imagens (Base64)
- [x] Integração WhatsApp para pedidos
- [x] Link para Instagram
- [x] Design responsivo

## Implementado (Janeiro 2026)
- ✅ Home page com hero, destaques, depoimentos, Instagram
- ✅ Página de Galeria com filtros por categoria
- ✅ Página Sobre com valores da empresa
- ✅ Página de Contato com FAQ
- ✅ Sistema de Login/Registro admin
- ✅ Dashboard admin com estatísticas
- ✅ CRUD de Bolos (nome, descrição, preço, imagem, categoria, destaque)
- ✅ CRUD de Categorias
- ✅ CRUD de Depoimentos
- ✅ Botão flutuante WhatsApp em todas as páginas
- ✅ Animações com Framer Motion
- ✅ Paleta de cores consistente (rosa/marrom/creme)
- ✅ Tipografia: Playfair Display (headings) + Manrope (body)
- ✅ Seed data com bolos e depoimentos iniciais

## Backlog (P0/P1/P2)
### P0 (Crítico) - Nenhum
### P1 (Importante)
- [ ] Sincronização automática com Instagram (requer conta Business + Graph API)
### P2 (Desejável)
- [ ] Sistema de favoritos para clientes
- [ ] Formulário de orçamento no site
- [ ] Notificações por email

## Próximos Passos
1. Configurar Instagram Business Account para sincronização
2. Adicionar fotos reais dos bolos da doceria
3. SEO optimization para buscas locais
