1. Install dependencies

   ```bash
   npm install
   ```
   é necessario instalar o node.js no seu dispositivo para usar npm

2. Start the app

   ```bash
   npx expo start --tunnel
   ```
   este programa é feito para mobile, será necessario instalar o Expo Go no seu dispositivo para testar.

3. if it doesn't work

   ```bash
   ip config on your cmd/powershell
   followed by
   setx /M REACT_NATIVE_PACKAGER_HOSTNAME YOUR_IP
   ```

O servidor utilisa o supabase, como tal, não é necessário darem setup, já são conectados aos servidor através de utils/supabase.ts
É possível ver a estrutura da nossa base de dados através do da imagem supabase-schema.svg
Para entrar na app, é necessario fazer login e verificação da conta, a verificação será enviada para o vosso email pelo supabase, esperem algum tempo até entrarem no link, mesmo que o ecrã esteja preto, vão estar verificados.

Trabalho realizado por: 
Francisco Miguel Quintal Gonçalves a2020125382
Pedro Miguel Vieira Moreira a2022144356