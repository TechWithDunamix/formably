from nexios.http import Request, Response
from nexios.routing import Router
from pydantic import create_model
from models import User
from ._models import CreateUser,LoginUser
from dto.responses import Success200,Error400
from nexios.auth.backends.jwt import create_jwt
from datetime import datetime, timedelta, UTC
from nexios.hooks import after_request
from utils.mailing import send_signupemail
from utils.crypto import generate_code
from models import OTPCode
from ._models import ConfirmUser

auth_router =  Router(prefix="/v1/auth", tags=["v1","auth"])

@auth_router.post("/register", 
                  summary="Register new User", 
                  request_model=CreateUser,
                  responses={
                      200:Success200,
                      400:Error400
                  })

@after_request(send_signupemail)
async def createNewUser(req :Request, res: Response):
    data = CreateUser(**await req.json)
    if await User.filter(email = data.email).exists():
        return res.json({"error":"User already exists"},status_code=400)
    user= await User.create_user(**data.model_dump())
    req.state.user = user
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


@auth_router.post("/confirm",
            summary="Confirm User",
            request_model=ConfirmUser,
            responses={
                200:Success200,
                400:Error400
            })
async def confirm(req :Request, res: Response):
    data = ConfirmUser(**await req.json)
    otp = await OTPCode.verify_code(data.user_id, data.code)
    if not otp:
        return res.json({"error":"Invalid Code"},status_code=400)
    
    otp.used = True
    user=  await otp.user
    user.is_activate = True
    await user.save()
    await otp.save()
    return res.json({"Success":"User Confirmed Successfully"})


@auth_router.post("/forgot-password",
            summary="Forgot Password",
            request_model=create_model("ForgotPassword", email=(str, ...)),
            responses={
                200:Success200,
                400:Error400
            })
async def forgot_password(req :Request, res: Response):
    data = await req.json
    email = data.get("email")
    if not email:
        return res.json({"error":"Email is required"},status_code=400)
    
    user = await User.filter(email=email).first()
    if not user:
        return res.json({"error":"User not found"},status_code=400)
    
    code = generate_code()
    otp = await OTPCode.create(user=user, code=code)
    
    # Here you would send the code to the user's email
    # For now, we just return the code in the response
    return {"code": otp.code}