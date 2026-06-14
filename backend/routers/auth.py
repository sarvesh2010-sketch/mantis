from fastapi import APIRouter, HTTPException
from models.schemas import RegisterRequest, LoginRequest
from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(body: RegisterRequest):
    # 1. Create Supabase auth user via Admin client to bypass rate limits and email confirmation
    try:
        print("DEBUG REGISTRATION (flushed):", flush=True)
        print("supabase _headers:", supabase.auth._headers, flush=True)
        
        res = supabase.auth.admin.create_user({
            "email": body.email,
            "password": body.password,
            "email_confirm": True
        })
        user_id = res.user.id
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        traceback.print_exc()
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
        from database import get_supabase
        auth_client = get_supabase()
        res = auth_client.auth.sign_in_with_password({"email": body.email, "password": body.password})
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
