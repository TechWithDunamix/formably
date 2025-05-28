from nexios.http import Request, Response
from nexios.routing import Router
from pydantic import create_model
from models import User
from ._models import CreateUser,LoginUser
from dto.responses import Success200,Error400
from nexios.auth.backends.jwt import create_jwt
from datetime import datetime, timedelta, UTC
from nexios.hooks import after_request
from utils.mailing import send_signupemail,send_reset_password_email
from utils.crypto import generate_code
from models import OTPCode
from ._models import ConfirmUser
from nexios.openapi import Query


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
    
    await send_reset_password_email(otp.code, user)
    return {"code": otp.code}


@auth_router.post("/reset-password",
            summary="Reset Password",
            parameters=[Query(name="user_id"),Query(name = "code")],
            request_model=create_model("ResetPassword", email=(str, ...)),
            responses={
                200:Success200,
                400:Error400
            })
async def reset_password(req :Request, res: Response):
    user_id, code = req.query_params.get("user_id"), req.query_params.get("code")
    obj = await OTPCode.verify_code(user_id, code)
   
    if not obj:
        return res.json({"error":"Invalid auth creds"}, status_code = 403)
    obj.used = True
    await obj.save() 
    request_data = await req.json
    password = request_data.get("password")
    if not password:
        return res.json({"error":"password is required"}, status_code = 400)
    
    user :User = await obj.user 
    user.set_password(password)
    await user.save()
    return {"Success":"Password Reset Successfully"}