from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional

from models.shop import Merch
from schema.shop import MerchCreate, MerchSchema, MerchUpdate
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee

router = APIRouter(prefix="/shop", tags=["Merchandise"])



@router.get("/", response_model=List[MerchSchema])
def list_merchandise(
    category: Optional[str] = None,
    offset: int = 0, 
    limit: int = 30, 
    session: Session = Depends(get_session)
):
 
    statement = select(Merch)
    if category:
        statement = statement.where(Merch.category == category)
    
    return session.exec(statement.offset(offset).limit(limit)).all()

@router.get("/{item_id}", response_model=MerchSchema)
def get_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Merch, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item



@router.post("/", response_model=MerchSchema, status_code=status.HTTP_201_CREATED)
def add_new_item(
    item_in: MerchCreate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
   
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    
    
    new_item = Merch.model_validate(item_in)
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item

@router.patch("/{item_id}", response_model=MerchSchema)
def update_stock_or_price(
    item_id: int, 
    item_in: MerchUpdate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
   
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Operation not permitted")
        
    db_item = session.get(Merch, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item