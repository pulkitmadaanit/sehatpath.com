// Basic interactivity: BMI, calories, form submissions, modal
document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Modal handling
  const modal = document.getElementById('modal');
  const bookBtn = document.getElementById('bookBtn');
  const modalClose = document.getElementById('modalClose');

  const openModal = () => {
    modal.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
  };

  bookBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // BMI calculation
  document.getElementById('calcBMI').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value);
    const out = document.getElementById('bmiResult');

    if (!w || !h) { out.textContent = 'Please enter weight (kg) and height (cm).'; return; }

    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;
    let cat = '';
    if (bmi < 18.5) cat = 'Underweight';
    else if (bmi < 25) cat = 'Normal weight';
    else if (bmi < 30) cat = 'Overweight';
    else cat = 'Obesity';

    out.textContent = `BMI: ${bmiRounded} — ${cat}. (This is a rough estimate; consult for a full assessment.)`;
  });

  // Calorie estimation (Mifflin-St Jeor)
  document.getElementById('calcCalories').addEventListener('click', () => {
    const age = parseFloat(document.getElementById('age').value);
    const sex = document.getElementById('sex').value;
    const activity = parseFloat(document.getElementById('activity').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const out = document.getElementById('calorieResult');

    if (!age || !weight || !height) { out.textContent = 'Please enter age, weight (kg), and height (cm).'; return; }

    // Mifflin St-Jeor
    let bmr;
    if (sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const tdee = Math.round(bmr * activity);
    out.textContent = `Estimated maintenance calories: ~${tdee} kcal/day. For weight loss aim for 300–700 kcal less (personalize with a dietitian).`;
  });

  // Contact form submission (Formspree placeholder)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';

    // Replace the endpoint with your Formspree ID or your server endpoint.
    const endpoint = 'https://formspree.io/f/{your-id}'; // <-- replace {your-id}
    const data = {
      name: document.getElementById('cname').value,
      email: document.getElementById('cemail').value,
      phone: document.getElementById('cphone').value,
      datetime: document.getElementById('cdatetime').value,
      message: document.getElementById('cmessage').value
    };

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        formStatus.textContent = 'Request sent! I will contact you to confirm the appointment.';
        contactForm.reset();
      } else {
        const json = await resp.json();
        formStatus.textContent = json?.error || 'Submission failed. Please email youremail@example.com';
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please try again or email youremail@example.com';
    }
  });

  // Booking form (modal) submission — similar to contact form
  const bookingForm = document.getElementById('bookingForm');
  const bookingStatus = document.getElementById('bookingStatus');

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    bookingStatus.textContent = 'Requesting...';
    const endpoint = 'https://formspree.io/f/{your-id}'; // <- replace
    const bdata = {
      name: document.getElementById('bname').value,
      email: document.getElementById('bemail').value,
      datetime: document.getElementById('bdatetime').value,
      notes: document.getElementById('bnotes').value
    };
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(bdata)
      });
      if (resp.ok) {
        bookingStatus.textContent = 'Booking request sent. I will follow up via email.';
        bookingForm.reset();
        setTimeout(() => { bookingStatus.textContent = ''; closeModal(); }, 1400);
      } else {
        bookingStatus.textContent = 'Failed to send booking request.';
      }
    } catch (err) {
      bookingStatus.textContent = 'Network error. Please try again later.';
    }
  });

  // CTA to open booking modal
  document.getElementById('getStarted').addEventListener('click', openModal);
});