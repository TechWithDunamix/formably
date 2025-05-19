from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "formresponse" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response" JSONB,
    "device_family" VARCHAR(512),
    "device_brand" VARCHAR(512),
    "device_os" VARCHAR(512),
    "device_browser" VARCHAR(512),
    "form_ref_id" UUID NOT NULL REFERENCES "forms" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "formresponse";"""
