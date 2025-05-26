@echo off
REM Kich hoat cac service cua he thong benh vien

REM User Service (port 4040)
start cmd /k "cd /d user && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4040"

REM Pharmaceutical Service (port 4044)
start cmd /k "cd /d pharmaceutical && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4044"

REM Patient Service (port 4041)
start cmd /k "cd /d patient_service && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4041"

REM Medical Record Service (port 4048)
start cmd /k "cd /d medical_record && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4048"

REM Employee Service (port 4043)
start cmd /k "cd /d employee_service && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4043"

REM Doctor Service (port 4042)
start cmd /k "cd /d doctor_service && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4042"

REM Disease Service (port 4046)
start cmd /k "cd /d disease_service && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4046"

REM Appointment Service (port 4049)
start cmd /k "cd /d appointment_service && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:4049"

REM Frontend (Vite, mac dinh port 5173)
start cmd /k "cd /d react-hospital-frontend && npm run dev"

@echo on 