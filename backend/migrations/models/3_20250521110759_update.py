from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        COMMENT ON COLUMN "Form Fields"."field_type" IS 'TEXT: text
TEXTAREA: textarea
NUMBER: number
INTEGER: integer
SCALE: scale
BOOLEAN: boolean
DATE: date
DATETIME: datetime
EMAIL: email
IMAGE_URL: image_url
UUID: uuid
SELECT: select
RADIO: radio
CHECKBOX: checkbox
MULTISELEC: multiselect
FILE: file';
        ALTER TABLE "forms" ADD "tag" VARCHAR(1);
        ALTER TABLE "forms" ADD "public_template" BOOL NOT NULL DEFAULT False;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "forms" DROP COLUMN "tag";
        ALTER TABLE "forms" DROP COLUMN "public_template";
        COMMENT ON COLUMN "Form Fields"."field_type" IS 'TEXT: text
NUMBER: number
BOOLEAN: boolean
DATE: date
EMAIL: email
IMAGE_URL: image_url';"""
