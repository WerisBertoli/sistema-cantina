# Configuração do Firebase Authentication para Recuperação de Senha

Para que a funcionalidade de recuperação de senha funcione corretamente, você precisa configurar o Firebase Authentication no console do Firebase.

## Passos para Configuração:

### 1. Acesse o Console do Firebase
- Vá para [Firebase Console](https://console.firebase.google.com/)
- Selecione seu projeto: `cantinaescolar-d73bc`

### 2. Configure o Authentication
- No menu lateral, clique em "Authentication"
- Vá para a aba "Sign-in method"
- Habilite o provedor "Email/Password" se ainda não estiver habilitado

### 3. Configure o Template de Email
- Ainda na seção Authentication, vá para a aba "Templates"
- Clique em "Password reset" (Redefinição de senha)
- Personalize o template do email:
  - **Assunto**: `Redefinição de senha - Cantina Digital Erlach`
  - **Remetente**: `noreply@cantinaescolar-d73bc.firebaseapp.com`
  - **Nome do remetente**: `Cantina Digital Erlach`

### 4. Configurar Domínio Autorizado
- Vá para a aba "Settings" > "Authorized domains"
- Adicione seu domínio de produção quando for fazer deploy
- Para desenvolvimento, `localhost` já está autorizado

### 5. Testar a Funcionalidade
- Acesse a tela de recuperação de senha: `http://localhost:5173/forgot-password`
- Digite um email válido que tenha uma conta no Firebase
- Clique em "Enviar instruções"
- Verifique se o email foi recebido

## Códigos de Erro Tratados:

- `auth/user-not-found`: Usuário não encontrado
- `auth/invalid-email`: Email inválido
- `auth/too-many-requests`: Muitas tentativas
- `auth/network-request-failed`: Erro de conexão

## Funcionalidades Implementadas:

✅ Integração com Firebase Authentication
✅ Validação de email
✅ Tratamento de erros específicos
✅ Interface responsiva
✅ Feedback visual para o usuário
✅ Redirecionamento automático após sucesso

## Próximos Passos:

1. Criar usuários de teste no Firebase Authentication
2. Testar o fluxo completo de recuperação
3. Personalizar ainda mais o template de email se necessário
4. Configurar domínio personalizado para emails (opcional)

## Observações:

- O Firebase enviará emails automaticamente quando `sendPasswordResetEmail()` for chamado
- Os emails são enviados do domínio `@cantinaescolar-d73bc.firebaseapp.com`
- O usuário receberá um link para redefinir a senha que o levará de volta ao Firebase
- Após redefinir a senha, o usuário pode fazer login normalmente na aplicação