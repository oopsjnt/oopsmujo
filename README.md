# Guia de Instalação e Uso - Oops Transportes Caramujo

Este guia contém instruções detalhadas para configurar, publicar e usar o aplicativo Oops Transportes Caramujo.

## Índice
1. [Funcionalidades Implementadas](#funcionalidades-implementadas)
2. [Publicação no GitHub Pages](#publicação-no-github-pages)
3. [Configuração do Firebase](#configuração-do-firebase)
4. [Personalização do Aplicativo](#personalização-do-aplicativo)
5. [Testando o Aplicativo](#testando-o-aplicativo)
6. [Solução de Problemas](#solução-de-problemas)
7. [Próximos Passos](#próximos-passos)

## Funcionalidades Implementadas

O aplicativo Oops Transportes Caramujo inclui as seguintes funcionalidades:

✅ **Cadastro de usuários** (passageiros e mototaxistas)  
✅ **Login/logout** com autenticação segura  
✅ **Solicitação de corridas** por passageiros  
✅ **Cancelamento de corridas** por passageiros  
✅ **Aceitação/recusa de corridas** por mototaxistas  
✅ **Lista de chegada** (mototaxista que recusou vai para o final)  
✅ **Timeout de 5 minutos** para aceitação de corridas  
✅ **Geolocalização** para captura automática da localização  
✅ **Perfil com foto** para usuários  
✅ **Sistema de avaliação** entre passageiros e mototaxistas  
✅ **Histórico de viagens** para passageiros e mototaxistas  
✅ **Contato via WhatsApp** após aceite da corrida  
✅ **Tema escuro** para melhor visualização  
✅ **PWA instalável** para uso como aplicativo nativo  
✅ **Design responsivo** para desktop e dispositivos móveis

## Publicação no GitHub Pages

### 1. Criar uma conta no GitHub
Se você ainda não tem uma conta no GitHub, crie uma em [github.com](https://github.com/).

### 2. Criar um novo repositório
1. Após fazer login, clique no botão "+" no canto superior direito e selecione "New repository"
2. Nomeie o repositório como `oops-transportes` (ou outro nome de sua preferência)
3. Deixe o repositório como "Public"
4. Clique em "Create repository"

### 3. Fazer upload dos arquivos
Existem duas maneiras de fazer upload dos arquivos:

#### Opção 1: Upload direto pela interface web (mais fácil)
1. No seu repositório, clique no botão "Add file" e selecione "Upload files"
2. Arraste todos os arquivos do aplicativo ou clique para selecionar os arquivos
3. Adicione uma mensagem de commit como "Primeira versão do aplicativo"
4. Clique em "Commit changes"

#### Opção 2: Usando Git (mais avançado)
```bash
git clone https://github.com/seu-usuario/oops-transportes.git
cd oops-transportes
# Copie todos os arquivos do aplicativo para esta pasta
git add .
git commit -m "Primeira versão do aplicativo"
git push origin main
```

### 4. Configurar o GitHub Pages
1. No seu repositório, vá para "Settings" (aba de configurações)
2. No menu lateral esquerdo, clique em "Pages"
3. Na seção "Source", selecione "Deploy from a branch"
4. Na seção "Branch", selecione "main" e "/root" e clique em "Save"
5. Aguarde alguns minutos para que o site seja publicado
6. Você verá uma mensagem com a URL do seu site (geralmente `https://seu-usuario.github.io/oops-transportes/`)

## Configuração do Firebase

### 1. Substituir as credenciais do Firebase
Antes de publicar o aplicativo, você precisa substituir as credenciais do Firebase no arquivo `script.js`:

1. Abra o arquivo `script.js`
2. Localize o objeto `firebaseConfig` no início do arquivo:
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
3. Substitua esse objeto com as suas próprias credenciais que você copiou do console do Firebase

### 2. Configurar regras de segurança do Firestore
Para garantir a segurança dos dados, acesse o console do Firebase e configure as regras do Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Regras específicas para coleções
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.passengerId == request.auth.uid || 
        resource.data.driverId == request.auth.uid ||
        request.resource.data.driverId == request.auth.uid
      );
    }
    
    match /ratings/{ratingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.ratedBy == request.auth.uid;
    }
    
    match /declinedRides/{declineId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Configurar o Firebase Hosting (opcional)
Se preferir usar o Firebase Hosting em vez do GitHub Pages:

1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Faça login no Firebase: `firebase login`
3. Inicialize o projeto: `firebase init`
   - Selecione "Hosting"
   - Selecione seu projeto Firebase
   - Use "public" como diretório público
   - Configure como SPA: "yes"
4. Copie todos os arquivos do aplicativo para a pasta "public"
5. Faça o deploy: `firebase deploy`

## Personalização do Aplicativo

### Alterar cores e tema
Para personalizar as cores do aplicativo, edite as variáveis CSS no arquivo `style.css`:

```css
:root {
    /* Variáveis de cores para tema claro */
    --bg-color: #f5f5f5;
    --card-bg: #ffffff;
    --text-color: #333333;
    --primary-color: #4a90e2;
    /* ... outras variáveis ... */
}

/* Tema escuro */
.dark-theme {
    --bg-color: #1a1a2e;
    --card-bg: #16213e;
    /* ... outras variáveis ... */
}
```

### Alterar ícones
Para alterar os ícones do aplicativo:

1. Crie novos ícones nos tamanhos necessários (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
2. Substitua os arquivos na pasta `icons/`
3. Atualize o `manifest.json` se necessário

## Testando o Aplicativo

### Fluxo de teste completo
Para testar todas as funcionalidades do aplicativo:

1. **Cadastro e Login**:
   - Crie uma conta de passageiro
   - Crie uma conta de mototaxista (use outro navegador ou modo anônimo)
   - Faça login com ambas as contas

2. **Perfil e Foto**:
   - Em cada conta, acesse o perfil
   - Adicione uma foto e atualize as informações

3. **Solicitação de Corrida**:
   - Na conta do passageiro, solicite uma corrida
   - Use a geolocalização para preencher o endereço atual

4. **Aceitação de Corrida**:
   - Na conta do mototaxista, defina o status como "Disponível"
   - Verifique se a corrida aparece na lista
   - Aceite a corrida

5. **Contato e Finalização**:
   - Verifique se o contato de WhatsApp aparece para ambos
   - No mototaxista, finalize a corrida

6. **Avaliação**:
   - Avalie o serviço em ambas as contas
   - Verifique se as avaliações aparecem no histórico

7. **Cancelamento**:
   - Solicite outra corrida como passageiro
   - Cancele a corrida
   - Verifique se é possível solicitar uma nova

8. **Timeout**:
   - Solicite uma corrida como passageiro
   - Não aceite como mototaxista
   - Verifique se a corrida é cancelada após 5 minutos

9. **PWA**:
   - Verifique se o banner de instalação aparece
   - Instale o aplicativo e teste offline

## Solução de Problemas

### Problemas comuns e soluções

1. **Erro ao fazer login/cadastro**:
   - Verifique se as credenciais do Firebase estão corretas
   - Verifique se o serviço de autenticação está ativado no Firebase

2. **Corridas não aparecem para mototaxistas**:
   - Verifique se o mototaxista está com status "Disponível"
   - Verifique se não há corridas antigas pendentes no banco de dados

3. **Geolocalização não funciona**:
   - Verifique se o navegador tem permissão para acessar a localização
   - Verifique se está usando HTTPS (necessário para geolocalização)

4. **PWA não instala**:
   - Verifique se todos os arquivos do manifest estão corretos
   - Verifique se o service worker está registrado corretamente
   - Use o Chrome DevTools (F12) para diagnosticar problemas

5. **Avaliações não aparecem**:
   - Verifique se as regras do Firestore permitem acesso à coleção "ratings"

### Verificando erros no console
Para verificar erros no aplicativo:

1. Abra o aplicativo no navegador
2. Pressione F12 para abrir as ferramentas de desenvolvedor
3. Vá para a aba "Console"
4. Verifique se há mensagens de erro em vermelho

## Próximos Passos

Sugestões para melhorar ainda mais o aplicativo:

1. **Integração com pagamentos** - Adicionar pagamento digital via PIX ou cartão
2. **Melhorias na geolocalização** - Adicionar mapa interativo para visualizar mototaxistas
3. **Notificações push** - Implementar notificações push completas para alertas em tempo real
4. **Estatísticas e relatórios** - Adicionar dashboard para administradores
5. **Versão para iOS/Android** - Converter para aplicativo nativo usando frameworks como React Native

---

Se precisar de mais ajuda ou tiver dúvidas, entre em contato!
