#!/bin/sh
set -e

echo "[Entrypoint] Starting MicroGrow container..."

# =============================================================================
# PRE-FLIGHT CHECKS
# =============================================================================

# Create required directories FIRST (before nginx -t)
echo "[Entrypoint] Creating required directories..."
mkdir -p /var/cache/nginx /var/run /etc/nginx/ssl

# Create nginx cache subdirectories (required by nginx -t)
mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp

# Set proper permissions (entrypoint runs as root initially)
chown -R nginx:nginx /var/cache/nginx 2>/dev/null || true

# Check if SSL certificates exist
if [ ! -f /etc/letsencrypt/live/microgrow.bio/fullchain.pem ]; then
    echo "[WARNING] SSL certificate not found at /etc/letsencrypt/live/microgrow.bio/"
    echo "[WARNING] HTTPS will fail. You can:"
    echo "[WARNING]   1. Run certbot to obtain Let's Encrypt certificate"
    echo "[WARNING]   2. Use self-signed certificate for development"
    echo "[WARNING]   3. Temporarily disable HTTPS server block in nginx.conf"
    echo "[INFO] Container will start with HTTP on port 80 only."
fi

# =============================================================================
# GENERATE DHPARAM (Optional - commented out for faster startup)
# =============================================================================
# DH parameters are currently commented out in nginx-basic.conf for faster testing
# Uncomment this section for production use
# if [ ! -f /etc/nginx/ssl/dhparam.pem ]; then
#     echo "[Entrypoint] DH parameters not found."
#     echo "[Entrypoint] Generating DH parameters (4096-bit)..."
#     echo "[INFO] This will take 5-10 minutes on first run..."
#     openssl dhparam -out /etc/nginx/ssl/dhparam.pem 4096
#     echo "[Entrypoint] DH parameters generated successfully."
# else
#     echo "[Entrypoint] DH parameters already exist, skipping generation."
# fi

# Verify nginx configuration syntax (AFTER creating log files)
echo "[Entrypoint] Testing Nginx configuration..."
if ! nginx -t 2>&1; then
    echo "[ERROR] Nginx configuration test failed!"
    echo "[ERROR] Please check your nginx.conf for syntax errors."
    exit 1
fi

# =============================================================================
# START NGINX
# =============================================================================
echo "[Entrypoint] Starting Nginx..."

# Execute CMD (nginx will run as nginx user for non-privileged operations)
exec "$@"
