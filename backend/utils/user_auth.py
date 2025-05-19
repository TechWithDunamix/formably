from models.users import User

async def get_user_by_id(**kwargs) -> User | None:
    return await User.filter(id=kwargs.get("user_id")).first()