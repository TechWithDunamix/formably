from nexios.config import MakeConfig
import os
try:
    from dotenv import load_dotenv

    load_dotenv()
    env_config = {key: value for key, value in os.environ.items()}
except ImportError:
    env_config = {}

default_config = {
    "debug": True,
    "title": "Backend",
    "secret_key" : env_config["SECRET_KEY"], #fix this in further version ,
    "cors":{
        "allow_origins" : ["*"],
        "allow_headers" : ["*"],
        "allow_methods" : ["*"]
    }
}

db_config =  {
    'connections': {
        'default': {
            'engine': 'tortoise.backends.asyncpg',
            'credentials': {
                'host': os.getenv("DB_HOST"),
                'port': os.getenv("DB_PORT"),
                'user': os.getenv("DB_USER"),
                'password': os.getenv("DB_PASSWORD"),
                'database':os.getenv("DB_NAME"),
            }
        }
    },
    "apps": {
        "models": {
            "models": ["models","aerich.models"],
            "default_connection": "default",
        }
    }
}

merged_config = {**default_config, **env_config}

app_config = MakeConfig(merged_config)
