from math import e
from nexios import Router
from nexios.http import Request, Response
from ._models import UpdateUser
from models import User
from nexios.auth.decorator import auth
from pydantic import create_model
accounts_router = Router(prefix="/v1/account")

@accounts_router.put("/update",
                      summary="Update User Information",
                      request_model=UpdateUser,
                      responses={
                          200: {"description": "User updated successfully"},
                          400: {"description": "Invalid input data"}
                      })
@auth(["jwt"])
async def update(req :Request, res: Response):
    data = UpdateUser(**await req.json) #type:ignore
    user :User = req.user #type:ignore
    if not user:
        return res.json({"error": "User not authenticated"}, status_code=401)
    
    if await User.exclude(email = user.email).filter(email = data.email).exists():
        return res.json({"message":"Email Already", 'errors' : {}}, status_code = 400)
    print(data.model_dump(exclude_unset=True))
    user.update_from_dict(data.model_dump(exclude_unset=True))
    await user.save()
    return {"success": "User updated successfully"}

@accounts_router.get("/me",
                   summary="Get Current User Information",
                   responses={
                       200: create_model("UserResponse", 
                                         email=(str, ...), 
                                         first_name=(str, ...), 
                                         last_name=(str, None), 
                                         company=(str, None), 
                                         is_activate=(bool, ...)),
                       401: create_model("ErrorResponse", error=(str, ...))
                   })
@auth(["jwt"])
async def me(req :Request, res: Response):
    user :User = req.user
    if not user:
        return res.json({"error": "User not authenticated"}, status_code=401)
    return user.to_dict()


@accounts_router.delete("/delete",
                      summary="Delete User Account",
                      responses={
                          200: {"description": "User deleted successfully"},
                          401: {"description": "User not authenticated"}
                      })
@auth(["jwt"])
async def delete(req :Request, res: Response):
    user :User = req.user
    if not user:
        return res.json({"error": "User not authenticated"}, status_code=401)
    await user.delete()
    return {"success": "User deleted successfully"}