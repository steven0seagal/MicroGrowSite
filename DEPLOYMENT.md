# MicroGrow Website - Nginx Deployment Guide

This guide provides comprehensive instructions for deploying the MicroGrow website on a server using Nginx.

## Prerequisites

- A server running Ubuntu 20.04+ or Debian 10+ (or similar Linux distribution)
- Root or sudo access to the server
- A domain name pointed to your server's IP address (optional but recommended)
- SSH access to your server

## Step 1: Build the Production Bundle

On your local machine, build the production-ready static files:

```bash
cd /path/to/MicroGrowSite
npm run build
```

This creates a `dist` folder containing all the static files needed for deployment.

## Step 2: Transfer Files to Server

Transfer the `dist` folder to your server using SCP, SFTP, or rsync:

```bash
# Using SCP
scp -r dist/ user@your-server-ip:/var/www/microgrow

# Using rsync (recommended)
rsync -avz --progress dist/ user@your-server-ip:/var/www/microgrow
```

## Step 3: Install Nginx

SSH into your server and install Nginx:

```bash
ssh user@your-server-ip

# Update package list
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

## Step 4: Configure Nginx

Create a new Nginx configuration file for the MicroGrow site:

```bash
sudo nano /etc/nginx/sites-available/microgrow
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Replace with your domain name
    server_name microgrow.com www.microgrow.com;
    
    # Root directory for static files
    root /var/www/microgrow;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle React Router (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Enable the Site

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/microgrow /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 5: Set Proper Permissions

Ensure Nginx can read the files:

```bash
sudo chown -R www-data:www-data /var/www/microgrow
sudo chmod -R 755 /var/www/microgrow
```

## Step 6: Configure Firewall

Allow HTTP and HTTPS traffic:

```bash
# Using UFW (Ubuntu)
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status

# Or manually
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Step 7: SSL/TLS Setup with Let's Encrypt (Recommended)

Secure your site with a free SSL certificate:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain and install certificate
sudo certbot --nginx -d microgrow.com -d www.microgrow.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically configure Nginx for HTTPS and set up auto-renewal.

### Verify Auto-Renewal

```bash
# Test renewal process
sudo certbot renew --dry-run

# Certificate will auto-renew via systemd timer
sudo systemctl status certbot.timer
```

## Step 8: Verify Deployment

Visit your domain in a browser:
- HTTP: `http://microgrow.com`
- HTTPS: `https://microgrow.com`

## Advanced Configuration

### Custom Nginx Configuration for Performance

For production, consider these additional optimizations in `/etc/nginx/nginx.conf`:

```nginx
http {
    # Connection settings
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # Buffer sizes
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    
    # Rate limiting (prevent abuse)
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req zone=general burst=20 nodelay;
    
    # Enable HTTP/2
    # (will be automatically enabled if using SSL)
}
```

### Content Security Policy (Optional)

Add to your server block in `/etc/nginx/sites-available/microgrow`:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;" always;
```

## Continuous Deployment

### Option 1: Manual Deployment Script

Create a deployment script `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "Building production bundle..."
npm run build

echo "Deploying to server..."
rsync -avz --delete dist/ user@your-server-ip:/var/www/microgrow

echo "Deployment complete!"
```

### Option 2: GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/microgrow
          SOURCE: dist/
```

## Monitoring and Logs

### View Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Site-specific logs (if configured)
sudo tail -f /var/log/nginx/microgrow-access.log
```

### Monitor Nginx Status

```bash
sudo systemctl status nginx
```

## Troubleshooting

### Common Issues

**1. 502 Bad Gateway**
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify file permissions: `ls -la /var/www/microgrow`

**2. 403 Forbidden**
- Fix permissions: `sudo chmod -R 755 /var/www/microgrow`
- Check SELinux (if applicable): `sudo setenforce 0`

**3. Site not updating**
- Clear browser cache
- Verify files on server: `ls -la /var/www/microgrow`
- Force reload Nginx: `sudo systemctl reload nginx`

**4. SSL certificate issues**
- Renew manually: `sudo certbot renew`
- Check certificate status: `sudo certbot certificates`

## Maintenance

### Update the Site

```bash
# On local machine
npm run build

# Transfer to server
rsync -avz --delete dist/ user@your-server-ip:/var/www/microgrow

# No need to restart Nginx for static file changes
```

### Update Nginx

```bash
sudo apt update
sudo apt upgrade nginx
sudo systemctl restart nginx
```

## Security Best Practices

1. **Keep system updated**: `sudo apt update && sudo apt upgrade`
2. **Enable firewall**: Only open necessary ports (80, 443, 22)
3. **Use SSL/TLS**: Always use HTTPS in production
4. **Regular backups**: Backup your site files and server configuration
5. **Monitor logs**: Set up log monitoring for suspicious activity
6. **Rate limiting**: Protect against DDoS attacks (already configured above)

## Performance Optimization

1. **Enable Brotli compression** (alternative to gzip, better compression)
2. **Use CDN** for static assets (CloudFlare, Cloudinary, etc.)
3. **Optimize images** before deployment
4. **Monitor server resources**: Use tools like `htop`, `netdata`

---

**Congratulations!** Your MicroGrow website is now deployed and secured with Nginx.

For support, check the [Nginx documentation](https://nginx.org/en/docs/) or [Let's Encrypt documentation](https://letsencrypt.org/docs/).
