#!/usr/bin/env python
"""
Setup script para preparar ambiente para produção
Execute: python setup.py
"""

import os
import sys
import json
from pathlib import Path

def create_env_file(filepath, content):
    """Cria arquivo .env se não existir"""
    if Path(filepath).exists():
        print(f"✓ {filepath} já existe")
    else:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"✓ Criado {filepath}")

def main():
    print("=" * 60)
    print("Paula Veiga Doces - Setup para Produção")
    print("=" * 60)
    
    # Verificar estrutura
    required_dirs = ['backend', 'frontend', 'backend/venv']
    
    print("\n📋 Verificando estrutura do projeto...")
    for dir_path in required_dirs[:-1]:  # Excluir venv da verificação
        if Path(dir_path).exists():
            print(f"✓ {dir_path}/ encontrado")
        else:
            print(f"✗ {dir_path}/ não encontrado")
    
    # Criar arquivos .env se necessário
    print("\n📝 Configurando variáveis de ambiente...")
    
    backend_env = """# Backend Configuration for Paula Veiga Doces
MONGODB_URL=mongodb://localhost:27017/paula_veiga_doces
CORS_ORIGINS=http://localhost:3000,http://localhost:3004
JWT_SECRET=sua-chave-secreta-muito-segura
DEBUG=False
"""
    
    frontend_env = """# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
"""
    
    create_env_file('backend/.env', backend_env)
    create_env_file('frontend/.env', frontend_env)
    
    # Verificar dependências
    print("\n📦 Verificando dependências...")
    
    # Python
    try:
        import pip
        print("✓ Python pip encontrado")
    except ImportError:
        print("✗ Python pip não encontrado - instale Python 3.8+")
        return False
    
    # Node
    node_version = os.popen('node --version').read().strip()
    if node_version:
        print(f"✓ Node.js {node_version} encontrado")
    else:
        print("✗ Node.js não encontrado - instale Node.js 14+")
        return False
    
    print("\n✅ Setup completado!")
    print("\nPróximos passos:")
    print("1. Configure as variáveis de ambiente em backend/.env e frontend/.env")
    print("2. Inicie o MongoDB: mongod")
    print("3. Execute: python setup_backend.py (no Windows)")
    print("4. Execute: npm install --legacy-peer-deps (no frontend)")
    print("5. Inicie o backend: uvicorn server:app --reload")
    print("6. Inicie o frontend: npm start")
    print("\n" + "=" * 60)
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
