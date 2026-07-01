from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from models.content import Blog  
from auth.deps import get_session 
from models.msee import Mzee

router = APIRouter()

#
@router.get("/", response_model=List[Blog])
def list_blogs(session: Session = Depends(get_session)):
    statement = select(Blog).where(Blog.status == "published")
    return session.exec(statement).all()


@router.get("/{slug}", response_model=Blog)
def get_blog(slug: str, session: Session = Depends(get_session)):
    blog = session.exec(select(Blog).where(Blog.slug == slug)).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Entry not found")
    return blog


@router.post("/create-blog", status_code=status.HTTP_201_CREATED)
def create_blog(blog_data: Blog, session: Session = Depends(get_session)):
    session.add(blog_data)
    session.commit()
    session.refresh(blog_data)
    return blog_data