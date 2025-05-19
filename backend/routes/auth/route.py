from nexios.http import Request, Response
from nexios.routing import Router
from models import User
from ._models import CreateUser,LoginUser
from dto.responses import Success200,Error400
from nexios.auth.backends.jwt import create_jwt
from datetime import datetime, timedelta, UTC

auth_router =  Router(prefix="/v1/auth", tags=["v1","auth"])

@auth_router.post("/register", 
                  summary="Register new User", 
                  request_model=CreateUser,
                  responses={
                      200:Success200,
                      400:Error400
                  })

async def createNewUser(req :Request, res: Response):
    data = CreateUser(**await req.json)
    if await User.filter(email = data.email).exists():
        return res.json({"error":"User already exists"},status_code=400)
    user= await User.create_user(**data.model_dump())
    return {"Success":"User Created Successfully"}



@auth_router.post("/login",
                summary="Login User",
                request_model=LoginUser,
                responses={
                    200:Success200,
                    400:Error400
                })
async def login(req :Request, res: Response):
    data = LoginUser(**await req.json)
    user = await User.filter(email = data.email).first()
    if not user:
        return res.json({"error":"User not found"},status_code=400)
    if not user.check_password(data.password):
        return res.json({"error":"Invalid Password"},status_code=400)
    return {"token":create_jwt({
        "user_id":str(user.id),
        "exp" : datetime.now(UTC) + timedelta(days=7)
    }),"user":user.to_dict()}
