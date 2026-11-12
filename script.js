const form = document.getElementById('insurance-form');
const errorMessage = document.getElementById('error-message');
const premiumOutput = document.getElementById('premium-output');
const resultDescription = document.getElementById('result-description');
const coverageValues = { 'third-party':0.86, 'third-party-fire-theft':1.22, comprehensive:1.68 };
const coverageLabels = { 'third-party':'third-party cover', 'third-party-fire-theft':'third-party, fire and theft cover', comprehensive:'fully comprehensive cover' };
const fields = [...form.querySelectorAll('input, select')];

function formatCurrency(amount) { return new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:2 }).format(amount); }
function resetQuote() { premiumOutput.textContent = '—'; resultDescription.textContent = 'Complete your details to see your personalised estimate.'; }

function validateForm() {
  let isValid = true;
  fields.forEach((field) => {
    const value = field.value.trim();
    const isEmpty = value === '';
    const isNumberOutOfRange = field.type === 'number' && ((field.min !== '' && Number(value) < Number(field.min)) || (field.max !== '' && Number(value) > Number(field.max)));
    const hasError = isEmpty || isNumberOutOfRange;
    field.classList.toggle('invalid', hasError);
    field.setAttribute('aria-invalid', String(hasError));
    if (hasError) isValid = false;
  });
  if (!isValid) { errorMessage.textContent = 'Please complete all fields with valid values.'; resetQuote(); return null; }
  errorMessage.textContent = '';
  return { age:Number(document.getElementById('age').value), power:Number(document.getElementById('power').value), yearsDriving:Number(document.getElementById('driving-years').value), carPrice:Number(document.getElementById('car-price').value), coverage:document.getElementById('coverage').value };
}

function calculatePremium(details) {
  let premium = details.carPrice * 0.07;
  if (details.age < 25) premium *= 1.45; else if (details.age < 35) premium *= 1.18; else if (details.age > 65) premium *= 1.12;
  if (details.power > 150) premium *= 1.22; else if (details.power > 100) premium *= 1.08;
  if (details.yearsDriving < 2) premium *= 1.55; else if (details.yearsDriving < 5) premium *= 1.25; else if (details.yearsDriving < 10) premium *= 1.1;
  return Math.max(premium * coverageValues[details.coverage], 180);
}

function updateQuote() {
  const details = validateForm();
  if (!details) return;
  premiumOutput.textContent = formatCurrency(calculatePremium(details));
  resultDescription.textContent = `Based on ${coverageLabels[details.coverage]} for a €${details.carPrice.toLocaleString('en-IE')} car.`;
}

fields.forEach((field) => { field.addEventListener('input', updateQuote); field.addEventListener('change', updateQuote); });
form.addEventListener('submit', (event) => { event.preventDefault(); updateQuote(); });
resetQuote();
