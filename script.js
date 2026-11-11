const form = document.getElementById('insurance-form');
const errorMessage = document.getElementById('error-message');
const premiumOutput = document.getElementById('premium-output');
const coverageValues = {
  'third-party': 0.86,
  'third-party-fire-theft': 1.22,
  comprehensive: 1.68,
};

const fields = [
  document.getElementById('age'),
  document.getElementById('power'),
  document.getElementById('driving-years'),
  document.getElementById('car-price'),
  document.getElementById('coverage'),
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function setFieldState(input, hasError) {
  input.classList.toggle('invalid', hasError);
}

function validateForm() {
  let isValid = true;

  fields.forEach((field) => {
    const value = field.value.trim();
    const hasError = value === '' || Number(value) <= 0;
    setFieldState(field, hasError);
    if (hasError) {
      isValid = false;
    }
  });

  if (!isValid) {
    errorMessage.textContent = 'Please complete all fields with valid values.';
    premiumOutput.textContent = '€0.00';
    return null;
  }

  const age = Number(document.getElementById('age').value);
  const power = Number(document.getElementById('power').value);
  const yearsDriving = Number(document.getElementById('driving-years').value);
  const carPrice = Number(document.getElementById('car-price').value);
  const coverage = document.getElementById('coverage').value;

  if (age < 18 || age > 100 || power < 10 || power > 500 || yearsDriving < 0 || yearsDriving > 70 || carPrice < 1000) {
    errorMessage.textContent = 'Please enter realistic values for each field.';
    premiumOutput.textContent = '€0.00';
    return null;
  }

  if (!(coverage in coverageValues)) {
    errorMessage.textContent = 'Please choose a coverage option.';
    premiumOutput.textContent = '€0.00';
    return null;
  }

  errorMessage.textContent = '';
  return {
    age,
    power,
    yearsDriving,
    carPrice,
    coverage,
  };
}

function calculatePremium(details) {
  let premium = details.carPrice * 0.07;

  if (details.age < 25) {
    premium *= 1.45;
  } else if (details.age < 35) {
    premium *= 1.18;
  } else if (details.age > 65) {
    premium *= 1.12;
  }

  if (details.power > 150) {
    premium *= 1.22;
  } else if (details.power > 100) {
    premium *= 1.08;
  }

  if (details.yearsDriving < 2) {
    premium *= 1.55;
  } else if (details.yearsDriving < 5) {
    premium *= 1.25;
  } else if (details.yearsDriving < 10) {
    premium *= 1.1;
  }

  premium *= coverageValues[details.coverage];

  return Math.max(premium, 180);
}

function updateQuote() {
  const details = validateForm();
  if (!details) {
    return;
  }

  const premium = calculatePremium(details);
  premiumOutput.textContent = formatCurrency(premium);
}

fields.forEach((field) => {
  field.addEventListener('input', updateQuote);
  field.addEventListener('change', updateQuote);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateQuote();
});

updateQuote();
