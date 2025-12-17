FROM python:3.12-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    netcat-openbsd \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar APENAS requirements primeiro (otimização de cache)
COPY requirements.txt .

# Instalar dependências Python (layer cacheável)
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação (muda frequentemente, vem por último)
COPY . .

# Criar usuário não-root
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Configurar permissões do entrypoint
RUN chmod +x /app/entrypoint.sh

# Trocar para usuário não-root
USER appuser

# Expor porta da API
EXPOSE 8002

# Variáveis de ambiente serão injetadas pelo docker-compose
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=app.settings

ENTRYPOINT ["/app/entrypoint.sh"]
