#!/bin/bash

USERNAME="cyber-log"
SERVICE_NAME="cyberlog.service"
CURRENT_DIR=$(pwd)
SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

APACHE_LOG_DIR="/var/log/apache2"
NGINX_LOG_DIR="/var/log/nginx"

# Criação do usuário
echo "Criando usuário $USERNAME..."
sudo useradd -m -s /bin/bash $USERNAME

cd /home/cyber-log/

git clone https://github.com/nicolasyassuda/cyber-log

# Grupo para logs
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

# Permissões para o diretório atual
echo "Configurando permissões para o diretório atual ($CURRENT_DIR)..."
sudo chown -R $USERNAME:logaccess $CURRENT_DIR
sudo chmod -R 750 $CURRENT_DIR

# Configuração do npm para o usuário
echo "Configurando o npm para o usuário $USERNAME..."
sudo -u $USERNAME mkdir -p /home/$USERNAME/.npm-global
sudo -u $USERNAME npm config set prefix '/home/$USERNAME/.npm-global'
echo "export PATH=/home/$USERNAME/.npm-global/bin:\$PATH" >> /home/$USERNAME/.bashrc

# Build da aplicação
echo "Executando 'npm run build'..."
sudo bash -c "cd /home/$USERNAME/cyber-log && npm install && npm run build"

# Criação do arquivo de serviço systemd
echo "Criando o arquivo de serviço $SERVICE_NAME em $SERVICE_PATH..."
sudo bash -c "cat > $SERVICE_PATH" <<EOL
[Unit]
Description=Aplicação Node.js - Cyber Log
After=network.target

[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=/home/cyber-log/cyber-log
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
