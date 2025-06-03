const stripe = Stripe('pk_test_51234567890abcdef');

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

if (currentTheme === 'dark') {
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

const products = {
    'code-generator': {
        name: 'Code Generator Pro',
        price: 4999,
        description: 'Advanced AI-powered code generation tool'
    },
    'api-toolkit': {
        name: 'API Toolkit Ultimate',
        price: 7999,
        description: 'Complete API development suite'
    },
    'debug-suite': {
        name: 'Debug Master Suite',
        price: 3499,
        description: 'Professional debugging tools'
    },
    'performance-analytics': {
        name: 'Performance Analytics',
        price: 5999,
        description: 'Real-time application monitoring'
    },
    'ide-extensions': {
        name: 'IDE Extensions Pack',
        price: 2499,
        description: 'Premium collection of IDE extensions'
    },
    'security-scanner': {
        name: 'Security Scanner Pro',
        price: 8999,
        description: 'Advanced security scanning tool'
    }
};

const buyButtons = document.querySelectorAll('.buy-button');

buyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const productId = button.getAttribute('data-product');
        const product = products[productId];

        if (!product) {
            alert('Product not found');
            return;
        }

        const originalText = button.innerHTML;
        button.innerHTML = '<span class="loading"></span> Processing...';
        button.disabled = true;

        try {
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                            description: product.description,
                        },
                        unit_amount: product.price,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                successUrl: window.location.origin + '/index.html?success=true',
                cancelUrl: window.location.origin + '/shop.html?canceled=true',
            });

            if (error) {
                console.error('Stripe error:', error);
                alert('Payment initialization failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment service temporarily unavailable. Please try again later.');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success') === 'true') {
    alert('Payment successful! Thank you for your purchase.');
    window.history.replaceState({}, document.title, window.location.pathname);
} else if (urlParams.get('canceled') === 'true') {
    alert('Payment was canceled.');
    window.history.replaceState({}, document.title, window.location.pathname);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.review-card, .product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('buy-button')) return;

            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(99, 102, 241, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.clientX - card.offsetLeft) + 'px';
            ripple.style.top = (e.clientY - card.offsetTop) + 'px';
            ripple.style.width = ripple.style.height = '10px';

            card.style.position = 'relative';
            card.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

const reviews = document.querySelectorAll('.review-card');
let current = 0;

function showNextReview() {
    reviews[current].classList.remove('active');
    current = (current + 1) % reviews.length;
    reviews[current].classList.add('active');
}

setInterval(showNextReview, 4000);
