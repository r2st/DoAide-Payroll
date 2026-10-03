"""Import all models so Base.metadata knows every table."""
from app.models.attendance import Attendance  # noqa: F401
from app.models.business import Business  # noqa: F401
from app.models.employee import Employee  # noqa: F401
from app.models.leave import Leave, LeaveBalance  # noqa: F401
from app.models.payroll_run import PayrollRun  # noqa: F401
from app.models.payslip import Payslip  # noqa: F401
from app.models.salary_structure import SalaryStructure  # noqa: F401
from app.models.statutory_filing import StatutoryFiling  # noqa: F401
from app.models.usage_tracking import UsageTracking  # noqa: F401
from app.models.user import User  # noqa: F401
