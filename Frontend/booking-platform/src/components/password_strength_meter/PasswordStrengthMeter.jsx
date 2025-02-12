import { Check, X } from "lucide-react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item, index) => (
        <div key={index} className="d-flex align-items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-success mr-2" />
          ) : (
            <X className="size-4 text-muted mr-2" />
          )}
          <span className={item.met ? "text-success" : "text-muted"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "danger";
    if (strength === 1) return "warning";
    if (strength === 2) return "warning";
    if (strength === 3) return "info";
    return "success"; // Changed from green-500
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-xs text-muted">Password strength</span>
        <Badge pill variant="secondary" className="text-xs">
          {getStrengthText(strength)}
        </Badge>
      </div>

      <ProgressBar className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <ProgressBar
            key={index}
            now={index < strength ? 25 : 0}
            variant={getColor(strength)}
            className="w-25 rounded-0 transition-colors duration-300"
          />
        ))}
      </ProgressBar>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
