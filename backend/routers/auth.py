from fastapi import APIRouter, HTTPException
from models.schemas import RegisterRequest, LoginRequest
from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(body: RegisterRequest):
    # 1. Create Supabase auth user
    try:
        res = supabase.auth.sign_up({"email": body.email, "password": body.password})
        user_id = res.user.id
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. If company role, create company record
    if body.role == "company":
        if not body.company_name:
            raise HTTPException(status_code=400, detail="company_name is required for company accounts")
        supabase.table("companies").insert({
            "user_id": user_id,
            "name": body.company_name,
        }).execute()

    return {"message": "Account created", "user_id": user_id, "role": body.role}

@router.post("/login")
async def login(body: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
        user = res.user
        session = res.session
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Check if company account
    company = supabase.table("companies").select("*").eq("user_id", user.id).maybe_single().execute()
    role = "company" if (company and company.data) else "user"

    return {
        "access_token": session.access_token,
        "user_id": user.id,
        "email": user.email,
        "role": role,
        "company": company.data if company else None,
    }
