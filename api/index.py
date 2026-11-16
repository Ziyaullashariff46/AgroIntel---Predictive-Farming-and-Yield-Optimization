import sys
import os

# Add root directory to sys.path so app, db, and all modules resolve cleanly on Vercel
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app import app


class VercelPathMiddleware:
    """
    WSGI Middleware to restore PATH_INFO when Vercel rewrites
    forward all incoming traffic to /api/index.
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        # Check edge rewrite headers for original requested path
        original_path = (
            environ.get('HTTP_X_MATCHED_PATH') or
            environ.get('HTTP_X_VERCEL_MATCHED_PATH') or
            environ.get('HTTP_X_FORWARDED_PREFIX') or
            environ.get('HTTP_X_REAL_PATH') or
            environ.get('HTTP_X_ORIGINAL_URL') or
            environ.get('REQUEST_URI')
        )
        if original_path:
            clean_path = original_path.split('?')[0]
            if clean_path and clean_path != '/api/index':
                environ['PATH_INFO'] = clean_path
            elif clean_path == '/api/index':
                environ['PATH_INFO'] = '/'
        elif environ.get('PATH_INFO') == '/api/index':
            environ['PATH_INFO'] = '/'

        return self.wsgi_app(environ, start_response)


# Wrap Flask application for Vercel Serverless Function runtime
app.wsgi_app = VercelPathMiddleware(app.wsgi_app)
