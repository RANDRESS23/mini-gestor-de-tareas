FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP necesarias
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    gd \
    opcache \
    bcmath

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copiar archivos de configuración primero
COPY composer.json composer.lock ./

# Instalar dependencias Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts --no-dev

# Copiar el resto de archivos
COPY . .

# Copiar archivo de entorno específico para Docker
COPY .env.docker .env

# Generar clave de aplicación solo si no existe en entorno
RUN php artisan key:generate --force

# Optimizar para producción
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Dar permisos a storage y cache
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Exponer puerto
EXPOSE 9000

CMD ["php-fpm"]
