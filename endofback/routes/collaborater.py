from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from models.collaboraters import Mamorio
from schema.collaboraters import CollaboraterCreate, CollaboraterSchema, CollaboraterUpdate
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee

router = APIRouter(prefix="/collaborators", tags=["Collaborators (Mamorio)"])



@router.get("/", response_model=List[CollaboraterSchema])
def list_collaborators(
    offset: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
    
    return session.exec(select(Mamorio).offset(offset).limit(limit)).all()

@router.get("/{collab_id}", response_model=CollaboraterSchema)
def get_collaborator(collab_id: int, session: Session = Depends(get_session)):
    collab = session.get(Mamorio, collab_id)
    if not collab:
        raise HTTPException(status_code=404, detail="Collaborator not found")
    return collab



@router.post("/", response_model=CollaboraterSchema, status_code=status.HTTP_201_CREATED)
def add_collaborator(
    collab_in: CollaboraterCreate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Only admins can manage the collaborator network"
        )

    existing = session.exec(select(Mamorio).where(Mamorio.email == collab_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Collaborator with this email already exists")

    new_collab = Mamorio.model_validate(collab_in)
    session.add(new_collab)
    session.commit()
    session.refresh(new_collab)
    return new_collab

@router.patch("/{collab_id}", response_model=CollaboraterSchema)
def update_collaborator(
    collab_id: int, 
    collab_in: CollaboraterUpdate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    db_collab = session.get(Mamorio, collab_id)
    if not db_collab:
        raise HTTPException(status_code=404, detail="Collaborator not found")
    
    update_data = collab_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_collab, key, value)
        
    session.add(db_collab)
    session.commit()
    session.refresh(db_collab)
    return db_collab