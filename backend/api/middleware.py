"""
Custom Security Middleware for Additional HTTP Headers
Adds extra security headers beyond Django's built-in security middleware
"""
from django.utils.deprecation import MiddlewareMixin


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Adds comprehensive security headers to all responses
    """
    
    def process_response(self, request, response):
        """
        Add security headers to response
        """
        # Prevent MIME type sniffing
        response['X-Content-Type-Options'] = 'nosniff'
        
        # Enable XSS filter in older browsers
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Control referrer information
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy (formerly Feature-Policy)
        response['Permissions-Policy'] = (
            'geolocation=(self), '
            'microphone=(), '
            'camera=(), '
            'payment=(), '
            'usb=(), '
            'magnetometer=(), '
            'gyroscope=(self), '
            'accelerometer=(self)'
        )
        
        # Content Security Policy (if not set by Django)
        if 'Content-Security-Policy' not in response:
            response['Content-Security-Policy'] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; "
                "img-src 'self' data: https: blob:; "
                "connect-src 'self' https://api.nasa.gov https://*.vercel.app; "
                "frame-ancestors 'none';"
            )
        
        # Expect-CT header for certificate transparency
        response['Expect-CT'] = 'max-age=86400, enforce'
        
        return response


class RateLimitHeaderMiddleware(MiddlewareMixin):
    """
    Adds rate limit information to API responses
    Helps clients implement proper backoff strategies
    """
    
    def process_response(self, request, response):
        """
        Add rate limit headers
        """
        # Only add to API endpoints
        if request.path.startswith('/api/'):
            response['X-RateLimit-Limit'] = '100'  # requests per hour
            response['X-RateLimit-Remaining'] = '99'  # placeholder
            response['X-RateLimit-Reset'] = '3600'  # seconds until reset
        
        return response
