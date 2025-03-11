document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const numberInput = document.getElementById('numberInput');
    const romanInput = document.getElementById('romanInput');
    const convertToRomanBtn = document.getElementById('convertToRomanBtn');
    const convertToIntBtn = document.getElementById('convertToIntBtn');
    const romanResult = document.getElementById('romanResult');
    const integerResult = document.getElementById('integerResult');
    const errorMessage = document.getElementById('errorMessage');

    // Helper functions
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('fade-in');
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    function showResult(element, result) {
        element.innerHTML = `<span class="fade-in">${result}</span>`;
    }

    function clearResult(element) {
        element.innerHTML = '<span class="placeholder">Result will appear here</span>';
    }

    // Convert integer to Roman
    async function convertToRoman() {
        clearError();
        romanResult.innerHTML = '<div class="spinner-border text-gold" role="status"></div>';

        const number = numberInput.value;

        if (!number) {
            showError('Please enter a number');
            clearResult(romanResult);
            return;
        }

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ number: parseInt(number) })
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.error);
                clearResult(romanResult);
                return;
            }

            showResult(romanResult, data.result);
        } catch (error) {
            showError('An error occurred. Please try again.');
            clearResult(romanResult);
        }
    }

    // Convert Roman to integer
    async function convertToInteger() {
        clearError();
        integerResult.innerHTML = '<div class="spinner-border text-gold" role="status"></div>';

        const roman = romanInput.value.toUpperCase();

        if (!roman) {
            showError('Please enter a Roman numeral');
            clearResult(integerResult);
            return;
        }

        try {
            const response = await fetch('/convert_roman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roman: roman })
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.error);
                clearResult(integerResult);
                return;
            }

            showResult(integerResult, data.result);
        } catch (error) {
            showError('An error occurred. Please try again.');
            clearResult(integerResult);
        }
    }

    // Event listeners
    convertToRomanBtn.addEventListener('click', convertToRoman);
    convertToIntBtn.addEventListener('click', convertToInteger);

    numberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertToRoman();
        }
    });

    romanInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertToInteger();
        }
    });

    // Input validation
    romanInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission prevention
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showError('Contact form submission is not implemented yet');
        });
    }
});