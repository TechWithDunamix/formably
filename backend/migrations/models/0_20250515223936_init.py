from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120),
    "email" VARCHAR(120) NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "company" VARCHAR(120),
    "is_activate" BOOL NOT NULL DEFAULT False
);
CREATE TABLE IF NOT EXISTS "forms" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(300) NOT NULL,
    "detail" TEXT,
    "logo" TEXT,
    "cover_image" TEXT,
    "max_response" INT,
    "is_active" BOOL NOT NULL DEFAULT True,
    "as_template" BOOL NOT NULL DEFAULT False,
    "active_until" TIMESTAMPTZ,
    "company_website" TEXT,
    "draft" BOOL NOT NULL DEFAULT False,
    "primary_color" VARCHAR(128) NOT NULL DEFAULT 'default',
    "secondary_school" VARCHAR(128) NOT NULL DEFAULT 'default',
    "collect_email" BOOL NOT NULL DEFAULT True,
    "multi_response" BOOL NOT NULL DEFAULT True,
    "owner_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "form_sections" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "order" INT NOT NULL DEFAULT 0,
    "form_ref_id" UUID NOT NULL REFERENCES "forms" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "Form Fields" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "field_order" INT NOT NULL DEFAULT 0,
    "field_name" VARCHAR(100) NOT NULL,
    "field_type" VARCHAR(20) NOT NULL,
    "required" BOOL NOT NULL DEFAULT True,
    "constraints" JSONB,
    "section" VARCHAR(512) NOT NULL,
    "form_ref_id" UUID NOT NULL REFERENCES "forms" ("id") ON DELETE CASCADE,
    "section_ref_id" UUID REFERENCES "form_sections" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "Form Fields"."field_type" IS 'TEXT: text\nNUMBER: number\nBOOLEAN: boolean\nDATE: date\nEMAIL: email\nIMAGE_URL: image_url';
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
