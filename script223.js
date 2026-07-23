const selections = {
    cuisine: '',
    date: '',
    time: '',
    address: ''
};

let maybeBtnRect = null;
let maybeBtnOriginalX = 0;
let maybeBtnOriginalY = 0;

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupEventListeners();
    setMinDate();
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

function setupEventListeners() {
    const yesBtn = document.getElementById('yesBtn');
    const maybeBtn = document.getElementById('maybeBtn');
    const nextStep2 = document.getElementById('nextStep2');
    const nextStep3 = document.getElementById('nextStep3');
    const nextStep4 = document.getElementById('nextStep4');
    const confirmBtn = document.getElementById('confirmBtn');
    const popupContinueBtn = document.getElementById('popupContinueBtn');

    yesBtn.addEventListener('click', () => goToStep(2));

    maybeBtn.addEventListener('mouseenter', handleMaybeBtnHover);
    maybeBtn.addEventListener('mousemove', handleMaybeBtnMove);
    maybeBtn.addEventListener('mouseleave', handleMaybeBtnLeave);
    maybeBtn.addEventListener('click', () => {
        alert('А давай всё же скажешь "Да" 💖');
    });

    document.querySelectorAll('.cuisine-card').forEach(card => {
        card.addEventListener('click', () => selectCuisine(card));
    });

    nextStep2.addEventListener('click', () => goToStep(3));
    nextStep3.addEventListener('click', () => goToStep(4));
    nextStep4.addEventListener('click', () => goToStep(5));
    confirmBtn.addEventListener('click', showConfirmationPopup);
    popupContinueBtn.addEventListener('click', () => {
        document.getElementById('confirmationPopup').classList.remove('active');
        goToStep('final');
    });
}

function setMinDate() {
    const datePicker = document.getElementById('datePicker');
    const today = new Date().toISOString().split('T')[0];
    datePicker.min = today;
}

function handleMaybeBtnHover(e) {
    const btn = e.target;
    if (!maybeBtnRect) {
        maybeBtnRect = btn.getBoundingClientRect();
        maybeBtnOriginalX = btn.offsetLeft;
        maybeBtnOriginalY = btn.offsetTop;
    }
}

function handleMaybeBtnMove(e) {
    const btn = e.target;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(rect.width, rect.height);
    
    if (distance < maxDistance) {
        const escapeX = -deltaX * 2;
        const escapeY = -deltaY * 2;
        const maxMove = 150;
        const clampedX = Math.max(-maxMove, Math.min(maxMove, escapeX));
        const clampedY = Math.max(-maxMove, Math.min(maxMove, escapeY));
        
        btn.style.transition = 'transform 0.3s ease-out';
        btn.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    }
}

function handleMaybeBtnLeave(e) {
    const btn = e.target;
    btn.style.transform = 'translate(0, 0)';
}

function selectCuisine(card) {
    document.querySelectorAll('.cuisine-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selections.cuisine = card.dataset.cuisine;
    document.getElementById('nextStep2').style.display = 'block';
}

function showConfirmationPopup() {
    document.getElementById('confirmationPopup').classList.add('active');
}

function goToStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    if (stepNumber === 5) {
        selections.date = document.getElementById('datePicker').value;
        selections.time = document.getElementById('timePicker').value;
        selections.address = document.getElementById('addressInput').value;
        updateSummary();
    }
    
    if (stepNumber === 'final') {
        document.body.classList.add('final-background');
        createHearts();
        createExtraParticles();
    }
    
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

function updateSummary() {
    const summary = document.getElementById('summary');
    summary.innerHTML = `
        <div class="summary-item"><strong>🍽️ Кухня:</strong> ${selections.cuisine}</div>
        <div class="summary-item"><strong>📅 Дата:</strong> ${selections.date}</div>
        <div class="summary-item"><strong>⏰ Время:</strong> ${selections.time}</div>
        <div class="summary-item"><strong>📍 Адрес:</strong> ${selections.address || 'Не указан'}</div>
    `;
}

function createHearts() {
    const heartsContainer = document.getElementById('hearts');
    const hearts = ['💖', '💕', '💗', '💝', '❤️', '💓', '💞', '💘'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
            heart.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 6000);
        }, i * 200);
    }
    
    setInterval(() => {
        if (document.getElementById('finalStep').classList.contains('active')) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
            heart.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 6000);
        }
    }, 300);
}

function createExtraParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (5 + Math.random() * 10) + 's';
            particle.style.width = (3 + Math.random() * 6) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `rgba(255, ${150 + Math.random() * 105}, ${180 + Math.random() * 75}, ${0.5 + Math.random() * 0.5})`;
            particlesContainer.appendChild(particle);
        }, i * 50);
    }
}
