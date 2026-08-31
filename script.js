const sections = document.querySelectorAll('div[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 50) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

function updatePortfolioAutoSlide() {
  const track = document.querySelector('.portfolio-track');
  if (!track) return;

  const pages = Array.from(track.querySelectorAll('.portfolio-page'));
  const visiblePages = pages.filter(page => page.querySelectorAll('.portfolio-card:not(.empty)').length > 0);

  if (visiblePages.length <= 1) {
    track.style.animation = 'none';
  } else {
    track.style.animation = 'portfolioAutoSlide 18s ease-in-out infinite';
  }
}

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) loader.style.display = "none";
  updatePortfolioAutoSlide();
});

// ============================================
// FORM SUBMISSION TO GOOGLE SHEETS
// ============================================

// Ganti dengan URL dari Google Apps Script Anda
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUAh18feBueI0322xbTYhnUUJ-GGauM1ggBXkLrlq_0WLPv8QeZFQf84InHHbq07JJYg/exec";

// Event listener untuk form submission
document.getElementById('contactForm')?.addEventListener('submit', function(event) {
  event.preventDefault(); // Cegah pengiriman form tradisional
  
  const form = event.target;
  const submitBtn = form.querySelector('#submitBtn');
  const responseMessage = document.getElementById('responseMessage');
  
  // Disable button saat proses pengiriman
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  
  // Ambil data dari form
  const formData = {
    name: document.getElementById('inputName').value,
    email: document.getElementById('inputEmail').value,
    suggestion: document.getElementById('inputSuggestion').value,
    timestamp: new Date().toLocaleString()
  };
  
  // Kirim data ke Google Apps Script
  // Kirim data ke Google Apps Script
  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      // UBAH BAGIAN INI: Gunakan text/plain agar tidak diblokir oleh CORS
      'Content-Type': 'text/plain;charset=utf-8', 
    },
    body: JSON.stringify(formData)
  })
  .then(() => {
    // Tampilkan pesan sukses
    responseMessage.style.display = 'block';
    responseMessage.innerHTML = '<div style="color: #28a745; background-color: rgba(40, 167, 69, 0.1); padding: 10px; border-radius: 5px; border-left: 4px solid #28a745;">✓ Thank you! Your message has been sent successfully.</div>';
    
    // Reset form
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    
    // Hapus pesan setelah 5 detik
    setTimeout(() => {
      responseMessage.style.display = 'none';
    }, 5000);
  })
  .catch((error) => {
    console.error('Error:', error);
    // Tampilkan pesan error
    responseMessage.style.display = 'block';
    responseMessage.innerHTML = '<div style="color: #dc3545; background-color: rgba(220, 53, 69, 0.1); padding: 10px; border-radius: 5px; border-left: 4px solid #dc3545;">✗ Error sending message. Please try again.</div>';
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  });
});