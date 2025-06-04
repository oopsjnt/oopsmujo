# Guia de Instalação e Uso - Oops Transportes Caramujo

## Índice
1. [Introdução](#introdução)
2. [Configuração Inicial](#configuração-inicial)
3. [Hospedagem no GitHub Pages](#hospedagem-no-github-pages)
4. [Hospedagem no Firebase](#hospedagem-no-firebase)
5. [Funcionalidades](#funcionalidades)
6. [Solução de Problemas](#solução-de-problemas)

## Introdução

Oops Transportes Caramujo é um aplicativo web progressivo (PWA) para gerenciamento de serviços de mototáxi no bairro Caramujo. O sistema permite cadastro de passageiros e mototaxistas, solicitação e aceitação de corridas, avaliações entre usuários, geolocalização e muito mais.

### Principais Funcionalidades
- Cadastro e login de usuários (passageiros e mototaxistas)
- Perfil com foto e informações de contato
- Solicitação de corridas com geolocalização
- Aceitação/recusa de corridas por mototaxistas
- Sistema de avaliação entre passageiros e mototaxistas
- Histórico de corridas
- Contato via WhatsApp após aceite da corrida
- Sugestões e melhorias
- Tema escuro/claro
- Instalável como aplicativo (PWA)

## Configuração Inicial

Antes de hospedar o aplicativo, você precisa configurar o Firebase:

1. **Substitua as credenciais do Firebase**:
   - Abra o arquivo `script.js`
   - Localize o objeto `firebaseConfig` no início do arquivo
   - Substitua com suas próprias credenciais do Firebase

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-messaging-sender-id",
    appId: "seu-app-id"
};
```

2. **Configure os serviços do Firebase**:
   - Ative a Autenticação (Email/Senha)
   - Configure o Firestore Database (modo de teste inicialmente)
   - Configure o Storage para armazenamento de imagens

## Hospedagem no GitHub Pages

O GitHub Pages é uma forma gratuita e simples de hospedar seu aplicativo:

1. **Crie uma conta no GitHub** (se ainda não tiver)
2. **Crie um novo repositório**:
   - Acesse https://github.com/new
   - Dê um nome ao repositório (ex: oops-transportes)
   - Deixe-o público
   - Clique em "Create repository"

3. **Faça upload dos arquivos**:
   - Clique em "uploading an existing file"
   - Arraste todos os arquivos da pasta do projeto
   - Clique em "Commit changes"

4. **Ative o GitHub Pages**:
   - Vá para "Settings" > "Pages"
   - Em "Source", selecione "main" e "/ (root)"
   - Clique em "Save"
   - Aguarde alguns minutos e seu site estará disponível em `https://seu-usuario.github.io/oops-transportes/`

## Hospedagem no Firebase

Para recursos mais avançados, você pode usar o Firebase Hosting:

1. **Instale o Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Faça login no Firebase**:
```bash
firebase login
```

3. **Inicialize o projeto**:
```bash
firebase init
```
   - Selecione "Hosting"
   - Selecione seu projeto Firebase
   - Use "public" como diretório público
   - Configure como aplicativo de página única: "Yes"

4. **Copie os arquivos para a pasta public**

5. **Faça o deploy**:
```bash
firebase deploy
```

6. Seu aplicativo estará disponível em `https://seu-projeto.web.app`

## Funcionalidades

### Para Passageiros
- Cadastro e login
- Edição de perfil com foto
- Solicitação de corridas com geolocalização
- Cancelamento de corridas
- Avaliação de mototaxistas
- Histórico de corridas
- Contato via WhatsApp com mototaxista
- Envio de sugestões

### Para Mototaxistas
- Cadastro e login
- Edição de perfil com foto
- Alteração de status (disponível/indisponível)
- Visualização de corridas solicitadas
- Aceitação/recusa de corridas
- Finalização de corridas
- Avaliação de passageiros
- Histórico de corridas
- Contato via WhatsApp com passageiro
- Envio de sugestões

## Solução de Problemas

### Corridas não aparecem para mototaxistas
- Verifique se o mototaxista está com status "Disponível"
- Verifique se há corridas pendentes no Firestore
- Tente atualizar a página

### Erro ao solicitar corrida
- Verifique se todos os campos estão preenchidos
- Verifique se não há outra corrida ativa
- Verifique as regras de segurança do Firestore

### Problemas com geolocalização
- Certifique-se de que o navegador tem permissão para acessar a localização
- Use um navegador moderno (Chrome, Firefox, Safari)
- Verifique se o site está sendo servido via HTTPS

### PWA não instalável
- Verifique se está usando HTTPS
- Certifique-se de que o manifest.json está correto
- Verifique se o service-worker.js está registrado corretamente
- Use o Chrome DevTools (Lighthouse) para diagnosticar problemas

### Outros problemas
- Verifique o console do navegador para erros
- Limpe o cache do navegador
- Verifique as regras de segurança do Firebase
