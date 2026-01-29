import json
import logging
from django.utils.timezone import now
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpRequest, HttpResponse


logger = logging.getLogger('expenselit.audit')


class AuditLoggingMiddleware(MiddlewareMixin):
    """
    Middleware for logging user actions and API requests.
    Logs all POST, PUT, PATCH, DELETE requests with user information.
    """

    # Sensitive fields that should not be logged
    SENSITIVE_FIELDS = [
        'password', 'token', 'key', 'secret', 'cvv',
        'security_code', '_security_code', 'csrf_token'
    ]

    # Paths to exclude from logging
    EXCLUDED_PATHS = [
        '/admin/jsi18n/',
        '/health/',
        '/ready/',
        '/live/',
        '/static/',
        '/media/',
    ]

    def process_request(self, request: HttpRequest) -> None:
        """Store request start time and body for performance tracking and logging"""
        request._audit_start_time = now()

        # Store request body for later use in logging
        # This is necessary because request.body can only be read once
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                request._cached_body = request.body
            except Exception:
                request._cached_body = None

        return None

    def process_response(self, request: HttpRequest,
                         response: HttpResponse) -> HttpResponse:
        """Log the request after processing"""

        # Skip logging for excluded paths
        if any(request.path.startswith(path) for path in self.EXCLUDED_PATHS):
            return response

        # Only log modification requests and errors
        if (request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] or
                response.status_code >= 400):
            self._log_request(request, response)

        return response

    def _log_request(self, request: HttpRequest,
                     response: HttpResponse) -> None:
        """Create audit log entry"""

        try:
            # Calculate request duration
            duration = None
            if hasattr(request, '_audit_start_time'):
                duration = ((now() - request._audit_start_time)
                            .total_seconds())

            # Prepare log data
            log_data = {
                'timestamp': now().isoformat(),
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'user': self._get_user_info(request),
                'ip_address': self._get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'duration_seconds': duration,
            }

            # Add request body for modification operations
            if request.method in ['POST', 'PUT', 'PATCH']:
                log_data['request_data'] = self._get_safe_request_data(request)

            # Add query parameters
            if request.GET:
                log_data['query_params'] = dict(request.GET)

            # Add response info for errors
            if response.status_code >= 400:
                log_data['error'] = True
                # Try to get error message from response
                try:
                    if hasattr(response, 'data'):
                        log_data['error_details'] = response.data
                    elif response.content:
                        content = response.content.decode('utf-8')
                        # Only log short error messages
                        if len(content) < 1000:
                            log_data['error_details'] = content
                except Exception:
                    pass

            # Log the audit entry
            if response.status_code >= 400:
                logger.error('API request failed', extra=log_data)
            else:
                logger.info('User action logged', extra=log_data)

        except Exception as e:
            # Don't let audit logging break the request
            logger.error(f'Failed to create audit log: {str(e)}')

    def _get_user_info(self, request: HttpRequest) -> dict:
        """Extract safe user information"""
        if hasattr(request, 'user') and request.user.is_authenticated:
            return {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
                'is_superuser': request.user.is_superuser,
            }
        return {'authenticated': False}

    def _get_client_ip(self, request: HttpRequest) -> str:
        """Get client IP address, handling proxies"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        return ip

    def _get_safe_request_data(self, request: HttpRequest) -> dict:
        """Get request data with sensitive fields removed"""
        try:
            # Use cached body if available
            if hasattr(request, '_cached_body') and request._cached_body:
                # Handle JSON request body
                if request.content_type == 'application/json':
                    data = json.loads(request._cached_body)
                else:
                    # Handle form data
                    data = dict(request.POST)
            else:
                # Fallback to POST data if body not cached
                data = dict(request.POST)

            # Remove sensitive fields
            safe_data = self._sanitize_data(data)

            # Limit size of logged data
            data_str = json.dumps(safe_data)
            if len(data_str) > 2000:
                return {'message': 'Request data too large to log'}

            return safe_data

        except Exception as e:
            return {'error': f'Could not parse request data: {str(e)}'}

    def _sanitize_data(self, data) -> dict:
        """Recursively remove sensitive fields from data"""
        if isinstance(data, dict):
            sanitized = {}
            for key, value in data.items():
                if any(sensitive in key.lower()
                       for sensitive in self.SENSITIVE_FIELDS):
                    sanitized[key] = '[REDACTED]'
                else:
                    sanitized[key] = self._sanitize_data(value)
            return sanitized
        elif isinstance(data, list):
            return [self._sanitize_data(item) for item in data]
        else:
            return data


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware to add security headers to responses.
    """

    def process_response(self, request: HttpRequest,
                         response: HttpResponse) -> HttpResponse:
        """Add security headers"""

        # Only add security headers to HTML responses and API responses
        content_type = response.get('Content-Type', '')
        if content_type.startswith(('text/html', 'application/json')):
            # Prevent MIME type sniffing
            response['X-Content-Type-Options'] = 'nosniff'

            # Enable XSS protection
            response['X-XSS-Protection'] = '1; mode=block'

            # Referrer policy
            response['Referrer-Policy'] = 'strict-origin-when-cross-origin'

            # Strict Transport Security (HSTS) - apenas em HTTPS
            # Em produção, descomentar a linha abaixo:
            # response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'

            # Content Security Policy (CSP)
            # Nota: 'unsafe-inline' mantido em style-src para compatibilidade com CSS-in-JS
            # Em producao, considerar implementar nonces para scripts
            response['Content-Security-Policy'] = (
                "default-src 'self'; "
                "script-src 'self'; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com data:; "
                "img-src 'self' data: https: blob:; "
                "connect-src 'self' http://localhost:* https:; "
                "frame-ancestors 'none'; "
                "base-uri 'self'; "
                "form-action 'self';"
            )

            # Permissions Policy (substitui Feature-Policy)
            response['Permissions-Policy'] = (
                "geolocation=(), "
                "microphone=(), "
                "camera=(), "
                "payment=(), "
                "usb=(), "
                "magnetometer=(), "
                "gyroscope=(), "
                "accelerometer=()"
            )

        # X-Frame-Options para prevenir clickjacking
        # Aplicar em todas as respostas
        response['X-Frame-Options'] = 'DENY'

        return response
