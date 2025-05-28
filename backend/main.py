from nexios import NexiosApp
from routes.index.route import index_router
from config import app_config, db_config
from db import register_tortoise
from pydantic import ValidationError
from utils.pydantic_error import handle_pydantic_error
from routes.auth import auth_router
from routes.forms import forms_router
from utils.user_auth import get_user_by_id
from nexios.auth.middleware import AuthenticationMiddleware
from nexios.auth.backends.jwt import JWTAuthBackend
from nexios.middlewares.cors import CORSMiddleware 
from routes.analytics.route import analytics_router
from routes.public import public_router
from routes.responses import responses_router
from routes.templates import templates_router
from routes.accounts import accounts_router
JWT_Backend = JWTAuthBackend(
    authenticate_func=get_user_by_id
)

# Create the application
app = NexiosApp(title="Formably API", 
                config=app_config,
                description="API for Formably",
                version="0.1.0",)
app.add_middleware(
    AuthenticationMiddleware(backend=JWT_Backend)
)
app.add_middleware(CORSMiddleware())
register_tortoise(app, config=db_config)

app.mount_router(auth_router)
app.mount_router(forms_router)
app.mount_router(public_router)
app.mount_router(responses_router)
app.mount_router(analytics_router)
app.mount_router(templates_router)
app.mount_router(accounts_router)
app.add_exception_handler(ValidationError,handle_pydantic_error)
