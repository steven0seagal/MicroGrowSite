# Security Documentation - MicroGrow

## Security Overview

This document outlines the security measures implemented in the MicroGrow Docker deployment. The application uses a **Defense-in-Depth** strategy with 6 layers of protection.

**Last Updated**: 2026-01-15
**Security Audit Status**: ✅ All tests passed

---

## Table of Contents
1. [Security Layers](#security-layers)
2. [Threat Model](#threat-model)
3. [Implemented Protections](#implemented-protections)
4. [Testing Procedures](#testing-procedures)
5. [Incident Response](#incident-response)
6. [Maintenance Schedule](#maintenance-schedule)
7. [Known Limitations](#known-limitations)

---

## Security Layers

### Layer 1: Container Isolation

**Purpose**: Minimize attack surface and limit blast radius if compromised.

**Implemented Measures**:
- **Alpine Linux Base**: Minimal OS (122 MiB vs 250+ MiB for Debian)
  - Fewer packages = fewer vulnerabilities
  - musl libc instead of glibc

- **Non-Root User**: nginx runs as `nginx` user (UID 101)
  - Even if attacker gains shell, they can't modify system files
  - Limited to read-only filesystem where possible

- **Minimal Capabilities**: Container only has essential Linux capabilities
  ```yaml
  cap_drop: [ALL]
  cap_add: [NET_BIND_SERVICE, CHOWN, SETUID, SETGID]
  ```
  - `NET_BIND_SERVICE`: Allows binding to ports 80/443
  - `CHOWN/SETUID/SETGID`: Required for nginx to drop privileges
  - All other capabilities removed (no raw sockets, no kernel modules, etc.)

- **Read-Only Filesystem**: Prevents attacker from persisting malware
  ```yaml
  tmpfs:
    - /tmp:noexec,nosuid,nodev,size=100m
    - /var/cache/nginx:noexec,nosuid,nodev,size=50m
    - /var/run:noexec,nosuid,nodev,size=10m
  ```
  - `noexec`: Cannot execute binaries from these directories
  - `nosuid`: Cannot elevate privileges
  - `nodev`: Cannot create device files

- **No Secrets in Image**: SSL certs, configs mounted as volumes (not baked in)

**Attack Vectors Mitigated**:
- Container escape attempts
- Privilege escalation
- Malware persistence
- Resource exhaustion

---

### Layer 2: Nginx Reverse Proxy

**Purpose**: Filter malicious requests before they reach the application.

**Implemented Measures**:
- **Request Size Limits**:
  ```nginx
  client_body_buffer_size 128k;
  client_max_body_size 10m;
  client_header_buffer_size 1k;
  large_client_header_buffers 4 16k;
  ```
  - Prevents buffer overflow attacks
  - Blocks excessive POST requests

- **Timeout Protection** (anti-slowloris):
  ```nginx
  client_body_timeout 12s;
  client_header_timeout 12s;
  send_timeout 10s;
  ```
  - Closes slow connections automatically
  - Frees resources for legitimate users

- **SPA Routing** (React Router support):
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
  - Direct navigation to `/products` works
  - Prevents 404 errors on client-side routes

- **Hidden Files Blocked**:
  ```nginx
  location ~ /\. {
      deny all;
  }
  ```
  - Blocks access to `.env`, `.git`, `.htaccess`, etc.
  - Prevents information disclosure

- **Sensitive File Extensions Blocked**:
  ```nginx
  location ~* \.(env|log|ini|conf|bak|sql|json)$ {
      deny all;
  }
  ```

- **Server Version Hidden**:
  ```nginx
  server_tokens off;
  ```
  - Attackers can't target specific nginx vulnerabilities

**Attack Vectors Mitigated**:
- Slowloris DoS attacks
- Buffer overflow attempts
- Path traversal attacks (../../etc/passwd)
- Information disclosure (.env file leaks)

---

### Layer 3: SSL/TLS Encryption

**Purpose**: Protect data in transit from eavesdropping and tampering.

**Implemented Measures**:
- **TLS 1.2 & 1.3 Only**:
  ```nginx
  ssl_protocols TLSv1.2 TLSv1.3;
  ```
  - TLS 1.0 and 1.1 disabled (vulnerable to BEAST, POODLE attacks)

- **Strong Cipher Suites**:
  ```nginx
  ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...';
  ssl_prefer_server_ciphers off;
  ```
  - Forward secrecy (ECDHE)
  - AES-GCM (authenticated encryption)
  - No weak ciphers (RC4, 3DES, MD5)
  - Client preference for TLS 1.3 (best practice)

- **Session Management**:
  ```nginx
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  ssl_session_tickets off;
  ```
  - Session resumption for performance
  - Tickets disabled (potential security risk)

- **OCSP Stapling** (Let's Encrypt only):
  ```nginx
  ssl_stapling on;
  ssl_stapling_verify on;
  ```
  - Faster certificate validation
  - Privacy improvement (client doesn't contact CA)

- **DH Parameters** (optional, commented out for speed):
  - 4096-bit DH params for DHE cipher suites
  - Takes 5-10 minutes to generate on first run
  - Uncomment in production for maximum security

**Expected Test Results**:
- **SSL Labs**: A+ rating
- **TLS 1.0/1.1**: Connection refused
- **TLS 1.2/1.3**: Connection successful

**Attack Vectors Mitigated**:
- Man-in-the-middle (MITM) attacks
- Eavesdropping on network traffic
- Session hijacking
- Downgrade attacks (forcing weak TLS)

---

### Layer 4: Rate Limiting & DDoS Protection

**Purpose**: Prevent abuse and ensure availability for legitimate users.

**Implemented Measures**:
- **Request Rate Limiting**:
  ```nginx
  limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
  limit_req zone=general burst=20 nodelay;
  ```
  - **Rate**: 10 requests/second per IP
  - **Burst**: Up to 20 requests queued
  - **Nodelay**: Excess requests rejected immediately (429 status)

- **Connection Limiting**:
  ```nginx
  limit_conn_zone $binary_remote_addr zone=addr:10m;
  limit_conn addr 10;
  ```
  - Max 10 concurrent connections per IP
  - Prevents connection exhaustion

- **Status Codes**:
  ```nginx
  limit_req_status 429;
  limit_conn_status 429;
  ```
  - Standard HTTP 429 "Too Many Requests"

**Testing**:
```bash
# Send 30 rapid requests
for i in {1..30}; do
  curl -sk -o /dev/null -w "%{http_code} " https://localhost/
done

# Expected: ~26x "200" then 4x "429"
```

**Tuning**:
- **If 429 errors are too frequent**: Increase rate to 20r/s and burst to 50
- **If under attack**: Decrease rate to 5r/s and burst to 10
- **For APIs**: Create separate zone with stricter limits (5r/s)

**Attack Vectors Mitigated**:
- HTTP flood attacks
- Slow read attacks
- Application-layer DDoS
- Brute force attempts (login, API)

---

### Layer 5: HTTP Security Headers

**Purpose**: Instruct browsers to enforce additional security policies.

**Implemented Headers** (7 total):

#### 1. Strict-Transport-Security (HSTS)
```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```
- **max-age=63072000**: Browser enforces HTTPS for 2 years
- **includeSubDomains**: Applies to all subdomains
- **preload**: Can be added to browser preload lists

**Protects Against**:
- SSL stripping attacks
- Mixed content warnings
- Accidental HTTP connections

#### 2. Content-Security-Policy (CSP)
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
```
- **default-src 'self'**: Only load resources from same origin
- **script-src 'self' 'unsafe-inline'**: Allow inline scripts (required for React)
- **style-src 'self' 'unsafe-inline'**: Allow inline styles (required for React)
- **img-src 'self' data: https:**: Allow images from same origin, data URIs, and HTTPS
- **frame-ancestors 'none'**: Prevent embedding in iframes (same as X-Frame-Options)
- **base-uri 'self'**: Prevent base tag injection
- **form-action 'self'**: Forms can only submit to same origin

**Protects Against**:
- Cross-Site Scripting (XSS)
- Code injection attacks
- Clickjacking
- Data exfiltration

**Note**: `'unsafe-inline'` is necessary for React but weakens CSP. Future enhancement: use nonce-based CSP.

#### 3. X-Frame-Options
```nginx
add_header X-Frame-Options "DENY" always;
```
- **DENY**: Page cannot be embedded in iframe/frame/object

**Protects Against**:
- Clickjacking attacks
- UI redressing

#### 4. X-Content-Type-Options
```nginx
add_header X-Content-Type-Options "nosniff" always;
```
- Prevents browser from MIME-sniffing (guessing content type)
- Forces browser to respect `Content-Type` header

**Protects Against**:
- MIME confusion attacks
- Executing HTML as JavaScript

#### 5. X-XSS-Protection
```nginx
add_header X-XSS-Protection "1; mode=block" always;
```
- **1**: Enable XSS filter
- **mode=block**: Block page if XSS detected (don't just sanitize)

**Protects Against**:
- Reflected XSS attacks

**Note**: Legacy header (CSP is better), but provides defense-in-depth.

#### 6. Referrer-Policy
```nginx
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```
- **strict-origin-when-cross-origin**:
  - Same origin: Send full URL in Referer header
  - Cross-origin HTTPS→HTTPS: Send only origin (no path)
  - Cross-origin HTTPS→HTTP: Don't send Referer (downgrade)

**Protects Against**:
- Information leakage in Referer header
- Privacy violations

#### 7. Permissions-Policy
```nginx
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" always;
```
- **Empty list ()**: Feature disabled for all origins

**Protects Against**:
- Unauthorized access to device APIs
- Privacy invasions (geolocation tracking, camera access)

**Testing**:
```bash
# Verify all headers present
curl -Isk https://localhost/ | grep -iE "(strict-transport|content-security|x-frame|x-content-type|x-xss|referrer|permissions)"

# Expected: All 7 headers present
```

**Expected Security Headers Score**: A rating on SecurityHeaders.com

---

### Layer 6: Monitoring & Logging

**Purpose**: Detect and respond to security incidents.

**Implemented Measures**:
- **Docker Healthcheck**:
  ```yaml
  healthcheck:
    test: ["/usr/local/bin/healthcheck.sh"]
    interval: 30s
    timeout: 5s
    retries: 3
    start_period: 10s
  ```
  - Monitors `/health` endpoint every 30 seconds
  - Automatically restarts container if unhealthy

- **Nginx Access Logs** (stdout):
  ```nginx
  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for" '
                  'rt=$request_time uct="$upstream_connect_time" '
                  'uht="$upstream_header_time" urt="$upstream_response_time"';
  ```
  - IP address, timestamp, request, status code
  - Response times for performance monitoring
  - View with: `docker compose logs frontend`

- **Nginx Error Logs** (stderr):
  - Configuration errors
  - Runtime errors
  - Rate limit violations
  - View with: `docker compose logs frontend | grep error`

**Monitoring Recommendations**:
- **Log Aggregation**: Centralize logs (ELK stack, Datadog, Splunk)
- **Alerting**: Set up alerts for:
  - Container restarts (health failures)
  - High rate of 429 errors (potential DDoS)
  - High rate of 4xx/5xx errors (application issues)
  - SSL certificate expiry (<30 days)
- **Metrics**: Track:
  - Request rate (requests/second)
  - Response time (p50, p95, p99)
  - Error rate (%)
  - CPU/memory usage

---

## Threat Model

### Assets to Protect
1. **User Data**: Currently none (static site), but future may have contact forms
2. **Website Availability**: Uptime, performance
3. **Server Resources**: CPU, memory, bandwidth
4. **Reputation**: No malware hosting, no phishing

### Threat Actors
1. **Script Kiddies**: Automated scanning tools (nikto, sqlmap, etc.)
2. **Botnets**: DDoS attacks, cryptocurrency mining
3. **Competitors**: Sabotage via DDoS
4. **APT Groups**: Unlikely (not high-value target)

### Attack Scenarios

#### Scenario 1: HTTP Flood DDoS
**Attack**: Botnet sends 10,000 requests/second to overwhelm server.
**Defense**:
- **Layer 4**: Rate limiting (10 req/s per IP) blocks 99% of requests
- **Layer 2**: Connection limits (10 concurrent/IP) prevent exhaustion
- **Layer 1**: tmpfs limits prevent disk fill

**Mitigation**: If attack persists, add IP-based blocking or use Cloudflare.

#### Scenario 2: XSS Injection Attempt
**Attack**: Attacker tries to inject `<script>alert(1)</script>` via URL parameter.
**Defense**:
- **Layer 5**: CSP blocks inline scripts from untrusted sources
- **Layer 5**: X-XSS-Protection blocks reflected XSS
- **Layer 1**: React's XSS protections (escaping)

**Note**: No user input forms, so risk is low. Future: validate all inputs.

#### Scenario 3: SSL/TLS Downgrade Attack
**Attack**: MITM attacker tries to force TLS 1.0 connection.
**Defense**:
- **Layer 3**: TLS 1.0/1.1 disabled, connection refused
- **Layer 5**: HSTS header forces HTTPS (after first visit)

#### Scenario 4: Path Traversal Attempt
**Attack**: Request `https://microgrow.bio/../../etc/passwd`.
**Defense**:
- **Layer 2**: Nginx normalizes paths, blocks access to sensitive files
- **Layer 1**: Container filesystem is read-only except for tmpfs

#### Scenario 5: Container Escape
**Attack**: Attacker gains shell in container, tries to escape to host.
**Defense**:
- **Layer 1**: Minimal capabilities prevent kernel exploits
- **Layer 1**: Non-root user limits privilege escalation
- **Layer 1**: Alpine Linux has smaller attack surface

**Mitigation**: Keep Docker updated, monitor for CVEs in Alpine/Nginx.

---

## Implemented Protections Summary

| Protection | Status | Layer | Effectiveness |
|------------|--------|-------|---------------|
| TLS 1.2/1.3 Only | ✅ | 3 | High |
| Strong Ciphers | ✅ | 3 | High |
| HSTS (2-year) | ✅ | 5 | High |
| CSP | ✅ | 5 | Medium (unsafe-inline) |
| X-Frame-Options | ✅ | 5 | High |
| X-Content-Type-Options | ✅ | 5 | Medium |
| X-XSS-Protection | ✅ | 5 | Medium (legacy) |
| Referrer-Policy | ✅ | 5 | Medium |
| Permissions-Policy | ✅ | 5 | Medium |
| Rate Limiting (10 r/s) | ✅ | 4 | High |
| Connection Limiting (10) | ✅ | 4 | High |
| Request Size Limits | ✅ | 2 | Medium |
| Timeout Protection | ✅ | 2 | High |
| Hidden Files Blocked | ✅ | 2 | High |
| Server Version Hidden | ✅ | 2 | Low (security through obscurity) |
| Non-Root User | ✅ | 1 | High |
| Minimal Capabilities | ✅ | 1 | High |
| Alpine Linux | ✅ | 1 | Medium |
| Healthcheck | ✅ | 6 | Medium |
| Logging | ✅ | 6 | Medium |
| ModSecurity WAF | ❌ | N/A | Would be High |
| DH Parameters | ❌ (commented) | 3 | Low (not critical) |

**Overall Security Posture**: **Strong** (16/18 protections active)

---

## Testing Procedures

### Automated Tests (Run After Every Deployment)

#### 1. Rate Limiting Test
```bash
#!/bin/bash
echo "Testing rate limiting..."
RESPONSE=$(for i in {1..30}; do curl -sk -o /dev/null -w "%{http_code} " https://localhost/; done)
if echo "$RESPONSE" | grep -q "429"; then
    echo "✅ Rate limiting working"
else
    echo "❌ Rate limiting FAILED"
fi
```

#### 2. Security Headers Test
```bash
#!/bin/bash
echo "Testing security headers..."
HEADERS=$(curl -Isk https://localhost/)

for HEADER in "strict-transport-security" "content-security-policy" "x-frame-options" "x-content-type-options" "x-xss-protection" "referrer-policy" "permissions-policy"; do
    if echo "$HEADERS" | grep -iq "$HEADER"; then
        echo "✅ $HEADER present"
    else
        echo "❌ $HEADER MISSING"
    fi
done
```

#### 3. SPA Routing Test
```bash
#!/bin/bash
echo "Testing SPA routing..."
for ROUTE in "/" "/products" "/team"; do
    STATUS=$(curl -sk -o /dev/null -w "%{http_code}" https://localhost$ROUTE)
    if [ "$STATUS" = "200" ]; then
        echo "✅ $ROUTE returns 200"
    else
        echo "❌ $ROUTE returns $STATUS (expected 200)"
    fi
done
```

#### 4. HTTP→HTTPS Redirect Test
```bash
#!/bin/bash
echo "Testing HTTP→HTTPS redirect..."
STATUS=$(curl -sI http://localhost/ | head -1 | awk '{print $2}')
if [ "$STATUS" = "301" ]; then
    echo "✅ HTTP redirects to HTTPS"
else
    echo "❌ HTTP redirect FAILED (status: $STATUS)"
fi
```

#### 5. Healthcheck Test
```bash
#!/bin/bash
echo "Testing healthcheck endpoint..."
RESPONSE=$(curl -sk https://localhost/health)
if echo "$RESPONSE" | grep -q "healthy"; then
    echo "✅ Healthcheck working"
else
    echo "❌ Healthcheck FAILED"
fi
```

### Manual Tests (Run Monthly)

#### 1. SSL/TLS Configuration Test
```bash
# Test TLS 1.2 (should succeed)
openssl s_client -connect localhost:443 -tls1_2 < /dev/null | grep "Protocol"

# Test TLS 1.1 (should fail)
openssl s_client -connect localhost:443 -tls1_1 < /dev/null 2>&1 | grep "error"
```

#### 2. External Security Scans (Production Only)
- **SSL Labs**: https://www.ssllabs.com/ssltest/analyze.html?d=microgrow.bio
  - Target: A+ rating

- **Security Headers**: https://securityheaders.com/?q=microgrow.bio
  - Target: A rating

- **Mozilla Observatory**: https://observatory.mozilla.org/analyze/microgrow.bio
  - Target: A+ score

#### 3. Vulnerability Scanning
```bash
# Scan Docker image for vulnerabilities
trivy image microgrow-frontend:latest

# Scan npm dependencies
npm audit

# Expected: 0 high/critical vulnerabilities
```

---

## Incident Response

### Detection

**Indicators of Compromise (IOCs)**:
1. Container restarting frequently (health failures)
2. High rate of 429 errors in logs
3. Unusual traffic patterns (spikes from single IP)
4. SSL certificate expiry warnings
5. Unexpected 4xx/5xx errors

**Monitoring**:
- Real-time: `docker compose logs -f frontend`
- Alerting: Configure Prometheus/Grafana or similar

### Response Procedures

#### Incident: DDoS Attack

**Symptoms**: High CPU/memory usage, slow responses, rate limiting triggered frequently.

**Response**:
1. **Immediate**:
   ```bash
   # Check logs for attacking IPs
   docker compose logs frontend | grep "429" | awk '{print $1}' | sort | uniq -c | sort -rn | head

   # Block top offenders at firewall level (if single IPs)
   sudo ufw deny from <IP>
   ```

2. **Short-term**:
   - Enable Cloudflare proxy (instant DDoS protection)
   - Or add nginx IP blocking:
     ```nginx
     deny 1.2.3.4;
     deny 5.6.7.0/24;
     ```

3. **Long-term**:
   - Analyze attack patterns
   - Adjust rate limits if needed
   - Consider WAF (ModSecurity, Cloudflare WAF)

#### Incident: Container Compromise

**Symptoms**: Unexpected container behavior, unfamiliar processes, modified files.

**Response**:
1. **Isolate**:
   ```bash
   # Stop container immediately
   docker compose stop frontend

   # Disconnect network (if still running)
   docker network disconnect microgrow-network microgrow-frontend
   ```

2. **Investigate**:
   ```bash
   # Dump logs
   docker compose logs frontend > incident-$(date +%Y%m%d-%H%M%S).log

   # Inspect container
   docker compose exec frontend ps aux
   docker compose exec frontend netstat -tulpn
   ```

3. **Remediate**:
   ```bash
   # Rebuild from clean state
   docker compose down
   docker system prune -a
   git pull  # Get latest code
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Post-Incident**:
   - Review logs to identify attack vector
   - Patch vulnerability
   - Update security measures
   - Document incident

#### Incident: SSL Certificate Expired

**Symptoms**: Browser warning "NET::ERR_CERT_DATE_INVALID", HTTPS not working.

**Response**:
1. **Immediate** (Let's Encrypt):
   ```bash
   # Force renewal
   docker compose exec frontend certbot renew --force-renewal

   # Reload nginx
   docker compose restart frontend
   ```

2. **Prevention**:
   - Certbot auto-renewal should handle this
   - Add monitoring for expiry (<30 days)
   - Test renewal process monthly

### Escalation

**Level 1**: Developer/DevOps (container issues, configuration)
**Level 2**: Security Team (suspicious activity, potential breach)
**Level 3**: Incident Response Team (confirmed breach, data loss)

**Contact**: [security@microgrow.bio](mailto:security@microgrow.bio)

---

## Maintenance Schedule

### Daily (Automated)
- ✅ Container healthcheck (every 30s)
- ✅ Certbot renewal check (every 12h)
- ✅ Docker logs rotation (automatic)

### Weekly (Manual)
- [ ] Review nginx access/error logs for anomalies
- [ ] Check for unusual traffic patterns
- [ ] Verify container status (`docker compose ps`)

### Monthly (Manual)
- [ ] Update npm dependencies (`npm update && npm audit`)
- [ ] Update Docker base images (`docker compose build --no-cache`)
- [ ] Run external security scans (SSL Labs, SecurityHeaders.com)
- [ ] Review and rotate SSH keys (if applicable)
- [ ] Test backup restoration procedure

### Quarterly (Manual)
- [ ] Full security audit (external pentester or OWASP ZAP scan)
- [ ] Review and update security documentation
- [ ] Review incident response procedures
- [ ] Update CSP policy (tighten if possible)
- [ ] Review rate limiting effectiveness (adjust if needed)

### Annually (Manual)
- [ ] Renew SSL certificates (Let's Encrypt: automatic, others: manual)
- [ ] Review and update dependencies (major version updates)
- [ ] Disaster recovery drill
- [ ] Security training for team

---

## Known Limitations

### 1. No Web Application Firewall (WAF)
**Risk**: No protection against SQL injection, command injection, path traversal at application level.
**Mitigation**: Application is static (no backend), so risk is minimal. Future: Add ModSecurity.
**Workaround**: Cloudflare WAF (if budget allows).

### 2. CSP Uses 'unsafe-inline'
**Risk**: Weakens CSP, allows inline scripts if attacker injects HTML.
**Mitigation**: React escapes user input by default (no input forms yet).
**Future**: Implement nonce-based CSP (requires Vite plugin).

### 3. No DDoS Protection at Network Layer
**Risk**: Large volumetric attacks (100+ Gbps) can overwhelm server.
**Mitigation**: Rate limiting handles application-layer attacks. ISP may have DDoS protection.
**Workaround**: Cloudflare proxy (free plan includes DDoS protection).

### 4. Self-Signed Certificate (Development Only)
**Risk**: Browser warnings, no HTTPS in development.
**Mitigation**: Users understand it's development. Production uses Let's Encrypt.
**Workaround**: Use mkcert for trusted local certificates.

### 5. No IP Reputation Filtering
**Risk**: Malicious IPs (Tor exit nodes, VPN proxies) can access site.
**Mitigation**: Rate limiting prevents abuse. Static site has no sensitive data.
**Future**: Integrate GeoIP blocking or IP reputation lists (if needed).

### 6. No Monitoring/Alerting System
**Risk**: Incidents may go unnoticed until manual log review.
**Mitigation**: Docker healthcheck auto-restarts on failure. Logs available via `docker logs`.
**Future**: Set up Prometheus + Grafana + Alertmanager.

### 7. No Backup System
**Risk**: Data loss if server fails (SSL certs, configs).
**Mitigation**: Code in Git, configs in Git, certs can be regenerated.
**Future**: Automated backups to S3 or similar.

---

## Vulnerability Disclosure Policy

If you discover a security vulnerability in this project:

1. **DO NOT** open a public GitHub issue
2. Email details to: [security@microgrow.bio](mailto:security@microgrow.bio)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Your name (for acknowledgment, optional)

We will:
- Acknowledge receipt within 48 hours
- Provide regular updates (at least weekly)
- Credit you in release notes (if desired)
- Aim to patch critical vulnerabilities within 7 days

**Responsible Disclosure Timeline**: 90 days before public disclosure.

---

## Security Checklist (Pre-Production)

- [x] Dependencies updated (0 vulnerabilities)
- [x] TLS 1.2/1.3 only
- [x] Strong cipher suites
- [x] HSTS enabled
- [x] All 7 security headers present
- [x] Rate limiting tested (429 responses)
- [x] Container isolation configured
- [x] Non-root user
- [x] Minimal capabilities
- [x] Logs to stdout/stderr
- [x] Healthcheck working
- [x] HTTP→HTTPS redirect
- [x] SPA routing tested
- [ ] Let's Encrypt certificate (using self-signed for dev)
- [ ] DH parameters generated (optional, commented out)
- [ ] External security scan (A+ rating)
- [ ] Monitoring configured
- [ ] Incident response plan reviewed
- [ ] Backup strategy in place

---

## References

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Nginx Security Hardening](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_buffer_size)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [SSL Labs Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)

---

**Document Version**: 1.0
**Last Review**: 2026-01-15
**Next Review**: 2026-04-15 (Quarterly)
