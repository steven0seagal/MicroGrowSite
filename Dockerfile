# =============================================================================
# DOCKERFILE - Production-ready with Security Hardening
# =============================================================================
# Version: without ModSecurity (can be added later via separate module)
# Focus: Container isolation, security headers, rate limiting, SSL/TLS

# =============================================================================
# STAGE 1: BUILD STAGE (React Application)
# =============================================================================
FROM node:22-alpine AS builder

# Security: Run as non-root during build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files first (layer caching optimization)
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .

# Build the application
RUN npm run build

# Verify build output
RUN test -f dist/index.html || (echo "Build failed: index.html not found" && exit 1)

# =============================================================================
# STAGE 2: PRODUCTION (Nginx Alpine)
# =============================================================================
FROM nginx:alpine

# Metadata
LABEL maintainer="security@microgrow.bio"
LABEL description="Hardened Nginx for MicroGrow SPA"
LABEL version="1.0.0"

# Install additional runtime dependencies
RUN apk add --no-cache \
    certbot certbot-nginx \
    openssl wget && \
    # Create nginx user (should already exist in nginx:alpine)
    # Create required directories
    mkdir -p /var/www/html /var/www/certbot /etc/nginx/ssl && \
    # Set permissions
    chown -R nginx:nginx /var/www/html && \
    chmod 750 /var/log/nginx

# Copy application build from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /var/www/html

# Copy configuration files
COPY --chown=root:root nginx-basic.conf /etc/nginx/nginx.conf
COPY --chown=root:root docker-entrypoint.sh /usr/local/bin/
COPY --chown=root:root healthcheck.sh /usr/local/bin/

# Make scripts executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/healthcheck.sh

# Security hardening
RUN rm -rf /tmp/* /var/cache/apk/*

# Expose ports
EXPOSE 80 443

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["/usr/local/bin/healthcheck.sh"]

# Start nginx via entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
