FROM php:7.3-apache-buster

RUN a2enmod rewrite

RUN apt-get update -y && \
    apt-get install zip -y && \
    apt-get install ca-certificates

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html

COPY vhost.conf /etc/apache2/sites-enabled/000-default.conf
