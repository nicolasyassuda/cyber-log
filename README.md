# Analisador de Logs de Servidor Web

## Descrição do Projeto

Este projeto tem como objetivo realizar a análise de logs de servidores web para identificar possíveis acessos suspeitos ou maliciosos. Ele foi projetado para suportar os formatos de log padrão do **Nginx** e do **Apache** e destina-se a ser executado exclusivamente em sistemas **Linux**.

Com o aumento de ataques direcionados a aplicações web, como **tentativas de exploração de vulnerabilidades**, **força bruta** e **scans automatizados**, este analisador fornece uma ferramenta prática para detectar comportamentos anômalos e melhorar a segurança dos servidores.

## Funcionalidades

- **Análise de logs do Nginx e Apache**:
  - Detecta padrões de comportamento suspeitos, como:
    - Verifica possiveis forças brutas.
    - Faz analise de SQL Injections.
    - Tentativa de acesso a diretorios.
    - Inserção de arquivos.
    - Tamanho do pacote de transmissão elevado (pegando a media geral de consumo da aplicações).
    - Filtro de multiplos acessos só traz logs que possuam mais de 5 acessos (poderia ser melhorado para trazer logs espaçados, mas estava meio sem tempo).
  - Identifica potenciais tentativas de injeção de código em URLs.

- **Relatório detalhado**:
  - Geração de um resumo dos acessos suspeitos identificados.
  - Classificação por tipo de comportamento suspeito (força bruta, scan, etc.).
  - Qual foi o log analisado (horario, ip, agent, referer, etc.).

- **Compatível com os formatos de log**:
  - Padrão do Nginx (`access.log`).
  - Padrão do Apache (`access_log`).

## Requisitos do Sistema

- Sistema Operacional: **Linux**
- Linguagem ao qual foi programado: Typescript usando o Framework NextJS-15.
- Dependencias: NodeJS, NextJS, SQLITE-better.
  
## Como Usar

- Basta clonar este repositorio em seu servidor Linux.
- E roda o script start_configuration.sh.
  - `sudo bash ./start_configuration.sh`
 ```
#!/bin/bash

USERNAME="cyber-log"
SERVICE_NAME="cyberlog.service"
SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

APACHE_LOG_DIR="/var/log/apache2"
NGINX_LOG_DIR="/var/log/nginx"

# Criação do usuário
echo "Criando usuário $USERNAME..."
sudo useradd -m -s /bin/bash $USERNAME

# Clonar o repositório
echo "Clonando repositório..."
sudo -u $USERNAME git clone https://github.com/nicolasyassuda/cyber-log /home/$USERNAME/cyber-log

# Configuração de permissões de log
echo "Configurando permissões de acesso aos logs..."
sudo groupadd -f logaccess
sudo usermod -aG logaccess $USERNAME

if [ -d "$APACHE_LOG_DIR" ]; then
  sudo chgrp -R logaccess $APACHE_LOG_DIR
  sudo chmod -R 750 $APACHE_LOG_DIR
  sudo chmod g+s $APACHE_LOG_DIR
fi

if [ -d "$NGINX_LOG_DIR" ]; then
  sudo chgrp -R logaccess $NGINX_LOG_DIR
  sudo chmod -R 750 $NGINX_LOG_DIR
  sudo chmod g+s $NGINX_LOG_DIR
fi

# Instalação do Node.js e npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "Instalando Node.js e npm..."
  sudo apt update
  sudo apt install -y nodejs npm
fi

# Configuração do npm para o usuário
echo "Configurando o npm para o usuário $USERNAME..."
sudo -u $USERNAME mkdir -p /home/$USERNAME/.npm-global
sudo -u $USERNAME npm config set prefix '/home/$USERNAME/.npm-global'
echo "export PATH=/home/$USERNAME/.npm-global/bin:\$PATH" | sudo tee -a /home/$USERNAME/.bashrc

# Build da aplicação
echo "Executando 'npm run build'..."
sudo -u $USERNAME bash -c "cd /home/$USERNAME/cyber-log && npm install && npm run build"

# Criação do arquivo de serviço systemd
echo "Criando o arquivo de serviço $SERVICE_NAME em $SERVICE_PATH..."
sudo bash -c "cat > $SERVICE_PATH" <<EOL
[Unit]
Description=Aplicação Node.js - Cyber Log
After=network.target

[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=/home/$USERNAME/cyber-log
Restart=always
User=$USERNAME
Group=logaccess
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cyberlog

[Install]
WantedBy=multi-user.target
EOL

# Atualização e habilitação do systemd
echo "Atualizando o systemd..."
sudo systemctl daemon-reload

echo "Habilitando o serviço $SERVICE_NAME para iniciar automaticamente..."
sudo systemctl enable $SERVICE_NAME

echo "Iniciando o serviço $SERVICE_NAME..."
sudo systemctl start $SERVICE_NAME

# Verifica o status do serviço
echo "Status do serviço:"
sudo systemctl status $SERVICE_NAME

```

