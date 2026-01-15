# MicroGrow - Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- SSL certificates (self-signed for development, Let's Encrypt for production)

### Start the Application

```bash
# Build and start containers
docker compose up -d

# View logs
docker compose logs -f frontend

# Check status
docker compose ps

# Stop containers
docker compose down
```

The application will be available at:
- **HTTP**: http://localhost:80 (redirects to HTTPS)
- **HTTPS**: https://localhost:443

## Architecture

### Multi-Stage Docker Build
1. **Builder Stage** (node:22-alpine):
   - Installs dependencies (`npm ci`)
   - Builds React application (`npm run build`)
   - Output: `dist/` directory (~5.6MB)

2. **Production Stage** (nginx:alpine):
   - Minimal Alpine Linux base (122 MiB total)
   - Nginx webserver with security hardening
   - SSL/TLS support with Let's Encrypt integration
   - Non-root execution where possible

### Security Layers

```
┌─────────────────────────────────────────────┐
│ Layer 6: Monitoring & Logging              │
│ ├─ Docker healthcheck (30s interval)       │
│ └─ Nginx logs to stdout/stderr             │
├─────────────────────────────────────────────┤
│ Layer 5: HTTP Security Headers             │
│ ├─ HSTS (2-year preload)                   │
│ ├─ CSP (Content Security Policy)           │
│ ├─ X-Frame-Options: DENY                   │
│ ├─ X-Content-Type-Options: nosniff         │
│ ├─ X-XSS-Protection                        │
│ ├─ Referrer-Policy                         │
│ └─ Permissions-Policy                      │
├─────────────────────────────────────────────┤
│ Layer 4: Rate Limiting & DDoS Protection   │
│ ├─ 10 requests/second per IP               │
│ ├─ Burst handling (20 requests)            │
│ └─ Connection limits (10 concurrent/IP)    │
├─────────────────────────────────────────────┤
│ Layer 3: SSL/TLS Encryption                │
│ ├─ TLS 1.2 & 1.3 only                      │
│ ├─ Strong cipher suites                    │
│ ├─ OCSP Stapling (for Let's Encrypt certs) │
│ └─ HTTP → HTTPS redirect                   │
├─────────────────────────────────────────────┤
│ Layer 2: Nginx Reverse Proxy               │
│ ├─ Request filtering                       │
│ ├─ Timeout protection (slowloris)          │
│ ├─ SPA routing (React Router)              │
│ └─ Static asset caching (1 year)           │
├─────────────────────────────────────────────┤
│ Layer 1: Container Isolation               │
│ ├─ Non-root nginx user                     │
│ ├─ Minimal capabilities (NET_BIND_SERVICE) │
│ ├─ tmpfs for temp directories              │
│ └─ Alpine Linux (minimal attack surface)   │
└─────────────────────────────────────────────┘
```

## SSL/TLS Setup

### Option A: Self-Signed Certificate (Development)

Already generated in `ssl/` directory. To regenerate:

```bash
mkdir -p ssl/live/microgrow.bio
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
  -keyout ssl/live/microgrow.bio/privkey.pem \
  -out ssl/live/microgrow.bio/fullchain.pem \
  -subj "/C=PL/ST=Warsaw/L=Warsaw/O=MicroGrow/CN=localhost"
```

### Option B: Let's Encrypt (Production)

1. **Initial Setup** - Temporarily disable HTTPS in nginx:
   ```bash
   # Comment out HTTPS server block (lines 148-276) in nginx-basic.conf
   # Or create nginx-http-only.conf with just HTTP server
   docker compose up -d frontend
   ```

2. **Obtain Certificate**:
   ```bash
   docker compose run --rm certbot certonly --webroot \
     -w /var/www/certbot \
     -d microgrow.bio \
     -d www.microgrow.bio \
     --email contact@microgrow.bio \
     --agree-tos
   ```

3. **Update docker-compose.yml** - Switch from bind mount to named volume:
   ```yaml
   volumes:
     # Comment out:
     # - ./ssl:/etc/letsencrypt:ro

     # Uncomment:
     - letsencrypt-certs:/etc/letsencrypt:ro
     - letsencrypt-www:/var/www/certbot:ro
   ```

4. **Enable HTTPS** - Restore full nginx-basic.conf and restart:
   ```bash
   docker compose restart frontend
   ```

5. **Auto-Renewal** - Certbot container automatically checks for renewal every 12 hours.

## Configuration Files

### Core Files
- **`Dockerfile`**: Multi-stage build (Node builder → Nginx runtime)
- **`docker-compose.yml`**: Container orchestration (frontend + certbot)
- **`nginx-basic.conf`**: Nginx configuration with security hardening
- **`docker-entrypoint.sh`**: Container initialization script
- **`healthcheck.sh`**: Docker healthcheck script

### Volume Mounts
```yaml
volumes:
  - ./ssl:/etc/letsencrypt:ro          # SSL certificates
  - ./ssl:/etc/nginx/ssl               # DH parameters (optional)
# Logs now go to stdout/stderr - view with: docker compose logs frontend
```

## Maintenance

### View Logs
```bash
# Real-time logs
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100 frontend

# Filter for errors
docker compose logs frontend | grep -i error
```

### Update Dependencies
```bash
# Update npm packages
npm audit
npm update
npm run build

# Rebuild Docker image
docker compose build --no-cache frontend
docker compose up -d
```

### Update Base Images
```bash
# Pull latest base images
docker compose pull

# Rebuild with latest
docker compose build --no-cache
docker compose up -d

# Clean up old images
docker image prune -a
```

### Health Monitoring
```bash
# Check container health
docker compose ps

# Manual healthcheck
curl -I http://localhost/health
# Expected: 301 Moved Permanently (redirects to HTTPS)

curl -Ik https://localhost/health
# Expected: 200 OK + "healthy"
```

### SSL Certificate Renewal (Let's Encrypt)
```bash
# Manual renewal (certbot auto-renews in background)
docker compose exec frontend certbot renew

# Check certificate expiry
openssl x509 -in ssl/live/microgrow.bio/fullchain.pem -noout -dates
```

## Troubleshooting

### Container Keeps Restarting

1. **Check logs**:
   ```bash
   docker compose logs frontend --tail=50
   ```

2. **Common issues**:
   - **Missing SSL certificate**: Container starts but nginx fails config test
     - Solution: Generate self-signed cert or disable HTTPS temporarily

   - **Permission denied on volumes**: Check host directory ownership
     - Solution: Ensure directories exist and are readable

   - **Port already in use**: Another service using port 80/443
     - Solution: `sudo netstat -tlnp | grep :80` to find process, stop it

3. **Test nginx config manually**:
   ```bash
   docker compose exec frontend nginx -t
   ```

### Rate Limiting Too Strict

If legitimate users are getting 429 errors:

1. **Edit `nginx-basic.conf`**:
   ```nginx
   # Increase from 10r/s to 20r/s
   limit_req_zone $binary_remote_addr zone=general:10m rate=20r/s;

   # Increase burst from 20 to 50
   limit_req zone=general burst=50 nodelay;
   ```

2. **Rebuild and restart**:
   ```bash
   docker compose down
   docker compose build --no-cache frontend
   docker compose up -d
   ```

### Security Headers Not Showing

1. **Verify config**:
   ```bash
   grep -n "add_header" nginx-basic.conf
   ```

2. **Test specific header**:
   ```bash
   curl -Isk https://localhost/ | grep -i "strict-transport"
   ```

3. **Remember**: Nested location blocks don't inherit `add_header` directives. Headers must be re-added in nested blocks (see `location = /index.html`).

### HTTPS Connection Refused

1. **Check if container is running**:
   ```bash
   docker compose ps
   # Status should be "Up" with health "healthy"
   ```

2. **Check if ports are mapped**:
   ```bash
   docker compose ps
   # Should show: 0.0.0.0:443->443/tcp
   ```

3. **Test from inside container**:
   ```bash
   docker compose exec frontend wget --spider https://localhost/health
   ```

4. **Check firewall**:
   ```bash
   sudo ufw status
   # Ensure ports 80 and 443 are allowed
   ```

### Build Fails

1. **Clear Docker cache**:
   ```bash
   docker compose build --no-cache
   ```

2. **Check disk space**:
   ```bash
   df -h
   docker system df
   ```

3. **Prune unused resources**:
   ```bash
   docker system prune -a
   ```

### SPA Routes Return 404

If direct navigation to `/products` or `/team` returns 404:

1. **Verify nginx config** has SPA routing:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

2. **Check if index.html exists**:
   ```bash
   docker compose exec frontend ls -la /var/www/html/
   # Should show: index.html and assets/
   ```

## Performance Optimization

### Enable Gzip Compression (Already Configured)
- CSS, JS, HTML, JSON, XML compressed
- 6x compression level (balance speed vs ratio)
- Saves ~70% bandwidth

### Static Asset Caching (Already Configured)
- Images, fonts: 1 year cache + immutable
- CSS, JS: 1 year cache + immutable
- index.html: no-cache (always fresh)

### HTTP/2 (Enabled)
- Multiplexing: multiple requests over single connection
- Header compression: reduced overhead
- Server push: not yet configured (future enhancement)

## Security Testing

### Test Rate Limiting
```bash
# Send 30 rapid requests
for i in {1..30}; do
  curl -sk -o /dev/null -w "%{http_code} " https://localhost/
done
echo ""

# Expected: First ~26 return 200, last 4 return 429
```

### Test Security Headers
```bash
# Check all headers
curl -Isk https://localhost/ | grep -iE "(strict-transport|content-security|x-frame|x-content-type|x-xss|referrer|permissions)"

# Expected: All 7 headers present
```

### Test SSL/TLS Configuration
```bash
# Check TLS version
openssl s_client -connect localhost:443 -tls1_2 < /dev/null
# Expected: Connection successful

openssl s_client -connect localhost:443 -tls1_1 < /dev/null
# Expected: Connection refused (TLS 1.1 disabled)
```

### External Security Scan (Production Only)
```bash
# SSL Labs test (manual - visit website)
https://www.ssllabs.com/ssltest/analyze.html?d=microgrow.bio

# Security Headers test (manual - visit website)
https://securityheaders.com/?q=microgrow.bio

# Expected: A+ rating on both
```

## Production Deployment Checklist

- [ ] Dependencies updated (`npm audit` = 0 vulnerabilities)
- [ ] Let's Encrypt certificate obtained (not self-signed)
- [ ] DH parameters generated (uncomment in nginx-basic.conf and docker-entrypoint.sh)
- [ ] Domain DNS configured (A/AAAA records point to server)
- [ ] Firewall configured (ports 80, 443 open)
- [ ] HTTP→HTTPS redirect working
- [ ] All security headers present (test with SecurityHeaders.com)
- [ ] Rate limiting tested (doesn't block legitimate users)
- [ ] SPA routing tested (direct navigation to /products, /team works)
- [ ] Healthcheck endpoint accessible
- [ ] Monitoring configured (log aggregation, uptime monitoring)
- [ ] Backup strategy in place (SSL certs, code, configs)

## Next Steps

### Optional Enhancements
1. **Add ModSecurity WAF** (not included due to complexity):
   - Use pre-built image: `owasp/modsecurity-crs:nginx-alpine`
   - Or compile from source (see `Dockerfile.source-build`)

2. **CDN Integration** (if traffic >100k/day):
   - Cloudflare for DDoS protection + caching
   - Or AWS CloudFront

3. **Monitoring & Alerting**:
   - Prometheus + Grafana for metrics
   - Sentry for error tracking
   - Uptime monitoring (UptimeRobot, Pingdom)

4. **CI/CD Pipeline**:
   - GitHub Actions for automated builds
   - Automated security scanning (Trivy, Snyk)
   - Blue-green deployments

5. **Self-host Fonts**:
   - Download Inter font family
   - Host in `public/fonts/`
   - Update `src/index.css` to use local fonts
   - Reduces external dependencies + improves privacy

## Support

- **Documentation**: See `SECURITY.md` for security details
- **Issues**: Report at repository issues page
- **Logs**: `docker compose logs frontend`
- **Health**: `curl http://localhost/health`
