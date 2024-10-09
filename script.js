// This function should log a success message to the console if EmailJS is loaded correctly
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS loaded successfully');
    } else {
        console.log('EmailJS not loaded');
    }
});
