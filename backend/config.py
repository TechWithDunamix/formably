import os
from nexios.config.base import MakeConfig

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

env_config = {key: value for key, value in os.environ.items()}

APP_ENV = env_config.get("APP_ENV", "development")

print("Env Config", env_config)
print("App Environment:", APP_ENV)

default_config = {
    "debug": APP_ENV != "production",
    "title": "Backend",
    "secret_key": env_config.get("SECRET_KEY", "dev-secret"),
    "cors": {
        "allow_origins": ["*"],
        "allow_headers": ["*"],
        "allow_methods": ["*"]
    }
}

# Define DB configs for each environment
db_configs = {
    "development": {
        'connections': {
            'default': {
                'engine': 'tortoise.backends.asyncpg',
                'credentials': {
                    'host': os.getenv("TEST_DB_HOST", "localhost"),
                    'port': os.getenv("TEST_DB_PORT", "5432"),
                    'user': os.getenv("TEST_DB_USER",),
                    'password': os.getenv("TEST_DB_PASSWORD"),
                    'database': os.getenv("TEST_DB_NAME"),
                }
            }
        },
        "apps": {
            "models": {
                "models": ["models", "aerich.models"],
                "default_connection": "default",
            }
        }
    },
    "production": {
        'connections': {
            'default': {
                'engine': 'tortoise.backends.asyncpg',
                'credentials': {
                    'host': os.getenv("DB_HOST"),
                    'port': os.getenv("DB_PORT"),
                    'user': os.getenv("DB_USER"),
                    'password': os.getenv("DB_PASSWORD"),
                    'database': os.getenv("DB_NAME"),
                }
            }
        },
        "apps": {
            "models": {
                "models": ["models", "aerich.models"],
                "default_connection": "default",
            }
        }
    },
    "test": {
        'connections': {
            'default': {
                'engine': 'tortoise.backends.asyncpg',
                'credentials': {
                    'host': os.getenv("TEST_DB_HOST", "localhost"),
                    'port': os.getenv("TEST_DB_PORT", "5432"),
                    'user': os.getenv("TEST_DB_USER", "testuser"),
                    'password': os.getenv("TEST_DB_PASSWORD", "testpass"),
                    'database': os.getenv("TEST_DB_NAME", "testdb"),
                }
            }
        },
        "apps": {
            "models": {
                "models": ["models", "aerich.models"],
                "default_connection": "default",
            }
        }
    }
}

db_config = db_configs.get(APP_ENV, db_configs["development"])

merged_config = {**default_config, **env_config}
app_config = MakeConfig(merged_config)
