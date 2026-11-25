from datetime import date, datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    CheckConstraint,
    func,
)

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    __table_args__ = (
        CheckConstraint("age >= 0 AND age <= 120", name="check_patient_age"),
        CheckConstraint(
            "gender IN ('Male', 'Female', 'Other')",
            name="check_patient_gender",
        ),
        CheckConstraint(
            "status IN ('Admitted', 'Discharged')",
            name="check_patient_status",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)

    ward = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    doctor = Column(String(100), nullable=False)

    admission_date = Column(Date, nullable=False)

    status = Column(
        String(20),
        nullable=False,
        default="Admitted",
        server_default="Admitted",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
