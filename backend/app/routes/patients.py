from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
)

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
):
    patient = Patient(**patient_data.model_dump())

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


@router.get("/", response_model=list[PatientResponse])
def get_patients(
    search: str | None = Query(default=None),
    ward: str | None = Query(default=None),
    department: str | None = Query(default=None),
    doctor: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Patient)

    if search:
        query = query.filter(Patient.name.ilike(f"%{search.strip()}%"))

    if ward:
        query = query.filter(Patient.ward == ward)

    if department:
        query = query.filter(Patient.department == department)

    if doctor:
        query = query.filter(Patient.doctor == doctor)

    return query.order_by(Patient.created_at.desc()).all()


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for field, value in patient_data.model_dump().items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    return patient


@router.delete("/{patient_id}", status_code=204)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(patient)
    db.commit()


@router.patch("/{patient_id}/discharge", response_model=PatientResponse)
def discharge_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if patient.status == "Discharged":
        raise HTTPException(
            status_code=400,
            detail="Patient is already discharged",
        )

    patient.status = "Discharged"

    db.commit()
    db.refresh(patient)

    return patient
