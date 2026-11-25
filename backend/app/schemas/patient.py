import re
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Gender = Literal["Male", "Female", "Other"]

Ward = Literal["General", "ICU", "Private", "Emergency"]

Department = Literal[
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
]

Doctor = Literal[
    "Dr. Sharma",
    "Dr. Verma",
    "Dr. Khan",
    "Dr. Gupta",
]


class PatientBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    age: int = Field(ge=0, le=120)
    gender: Gender
    ward: Ward
    department: Department
    doctor: Doctor
    admission_date: date

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Patient name is required")

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise ValueError("Name must contain letters and spaces only")

        return value

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Admission date cannot be in the future")

        return value


class PatientCreate(PatientBase):
    pass


class PatientUpdate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int
    status: Literal["Admitted", "Discharged"]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
 