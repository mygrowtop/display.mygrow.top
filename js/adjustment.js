document.addEventListener('DOMContentLoaded', () => {
    // Initialize the adjustment page
    initAdjustmentPage();
});

function initAdjustmentPage() {
    // Get the scenario from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const scenario = urlParams.get('scenario') || 'gaming';
    
    // Load scenario data
    loadScenarioData(scenario);
    
    // Initialize sliders
    initSliders();
    
    // Add event listeners to buttons
    document.querySelector('.reset-button').addEventListener('click', resetToDefault);
    document.querySelector('.save-button').addEventListener('click', saveSettings);
    
    // Add keyboard controls
    initKeyboardControls();
    
    // Load saved settings if available
    loadSavedSettings(scenario);
}

// Scenario configurations
const scenarioConfigs = {
    gaming: {
        title: 'Gaming Display Optimization',
        description: 'Adjust your display for the best gaming experience with optimal visibility in dark scenes.',
        referenceImage: createGamingReferenceImage,
        imageInstructions: 'Adjust until you can see the circle in the dark area',
        presets: [
            { name: 'Action/FPS', brightness: 110, contrast: 120, saturation: 110, temperature: 6700 },
            { name: 'Horror', brightness: 90, contrast: 130, saturation: 80, temperature: 5500 },
            { name: 'Strategy', brightness: 105, contrast: 110, saturation: 100, temperature: 6300 },
            { name: 'Colorful Games', brightness: 105, contrast: 115, saturation: 120, temperature: 7000 }
        ]
    },
    reading: {
        title: 'Reading Mode',
        description: 'Optimize your display for comfortable reading with reduced eye strain.',
        referenceImage: createReadingReferenceImage,
        imageInstructions: 'Adjust until text appears clear and comfortable to read',
        presets: [
            { name: 'Daytime', brightness: 100, contrast: 100, saturation: 90, temperature: 6000 },
            { name: 'Night Mode', brightness: 80, contrast: 90, saturation: 80, temperature: 4500 },
            { name: 'E-paper', brightness: 90, contrast: 110, saturation: 50, temperature: 5500 },
            { name: 'Long Sessions', brightness: 85, contrast: 95, saturation: 85, temperature: 5000 }
        ]
    },
    office: {
        title: 'Office & Productivity',
        description: 'Settings optimized for work environments and reducing eye fatigue.',
        referenceImage: createOfficeReferenceImage,
        imageInstructions: 'Adjust until spreadsheet grid lines are clearly visible',
        presets: [
            { name: 'Documents', brightness: 95, contrast: 100, saturation: 90, temperature: 5800 },
            { name: 'Spreadsheets', brightness: 100, contrast: 105, saturation: 95, temperature: 6200 },
            { name: 'Presentations', brightness: 105, contrast: 110, saturation: 105, temperature: 6500 },
            { name: 'Coding', brightness: 90, contrast: 110, saturation: 85, temperature: 5500 }
        ]
    },
    videos: {
        title: 'Short Video Optimization',
        description: 'Enhanced colors and brightness for social media and short-form videos.',
        referenceImage: createVideosReferenceImage,
        imageInstructions: 'Adjust until colors appear vibrant and balanced',
        presets: [
            { name: 'Vibrant', brightness: 110, contrast: 120, saturation: 130, temperature: 7000 },
            { name: 'Balanced', brightness: 105, contrast: 110, saturation: 110, temperature: 6500 },
            { name: 'Cinematic', brightness: 100, contrast: 115, saturation: 105, temperature: 6000 },
            { name: 'Cool Tones', brightness: 105, contrast: 110, saturation: 100, temperature: 7500 }
        ]
    },
    movies: {
        title: 'Movie & TV Experience',
        description: 'Cinema-quality settings with perfect black levels and color reproduction.',
        referenceImage: createMoviesReferenceImage,
        imageInstructions: 'Adjust until you can see details in the darkest areas',
        presets: [
            { name: 'Cinema', brightness: 95, contrast: 120, saturation: 100, temperature: 5800 },
            { name: 'Drama', brightness: 100, contrast: 110, saturation: 95, temperature: 6000 },
            { name: 'Action', brightness: 105, contrast: 125, saturation: 110, temperature: 6300 },
            { name: 'Sci-Fi', brightness: 100, contrast: 120, saturation: 105, temperature: 7000 }
        ]
    }
};

function loadScenarioData(scenario) {
    // Get scenario config
    const config = scenarioConfigs[scenario] || scenarioConfigs.gaming;
    
    // Set title and description
    document.getElementById('scenario-title').textContent = config.title;
    document.getElementById('scenario-description').textContent = config.description;
    
    // Set image instructions
    if (document.getElementById('image-instructions')) {
        document.getElementById('image-instructions').textContent = config.imageInstructions;
    }
    
    // Create reference image
    const referenceImageElement = document.getElementById('reference-image');
    referenceImageElement.innerHTML = '';
    if (config.referenceImage && typeof config.referenceImage === 'function') {
        config.referenceImage(referenceImageElement);
    }
    
    // Load presets
    loadPresets(config.presets);
}

function loadPresets(presets) {
    const presetButtonsContainer = document.getElementById('preset-buttons');
    presetButtonsContainer.innerHTML = '';
    
    presets.forEach(preset => {
        const presetButton = document.createElement('div');
        presetButton.className = 'preset-button';
        presetButton.textContent = preset.name;
        presetButton.addEventListener('click', () => {
            applyPreset(preset);
            
            // Add audio feedback
            playAudioFeedback('click');
        });
        presetButtonsContainer.appendChild(presetButton);
    });
}

function applyPreset(preset) {
    // Apply preset values to sliders
    document.getElementById('brightness').value = preset.brightness;
    document.getElementById('contrast').value = preset.contrast;
    document.getElementById('saturation').value = preset.saturation;
    document.getElementById('temperature').value = preset.temperature;
    
    // Update displayed values
    updateSliderValues();
    
    // Apply filters to reference image
    applyFilters();
    
    // Highlight the active preset
    const presetButtons = document.querySelectorAll('.preset-button');
    presetButtons.forEach(button => {
        if (button.textContent === preset.name) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function initSliders() {
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        // Update value display when slider is moved
        slider.addEventListener('input', () => {
            updateSliderValues();
            applyFilters();
            
            // Add audio feedback
            playAudioFeedback('slide');
        });
        
        // Add visual feedback on slider focus
        slider.addEventListener('focus', () => {
            slider.parentElement.classList.add('active-control');
        });
        
        slider.addEventListener('blur', () => {
            slider.parentElement.classList.remove('active-control');
        });
    });
    
    // Initialize displayed values
    updateSliderValues();
}

function initKeyboardControls() {
    // Add keyboard event listener
    document.addEventListener('keydown', (e) => {
        const brightnessSlider = document.getElementById('brightness');
        const contrastSlider = document.getElementById('contrast');
        const saturationSlider = document.getElementById('saturation');
        const temperatureSlider = document.getElementById('temperature');
        
        const step = 5; // Adjustment step
        
        switch(e.key) {
            case 'ArrowUp':
                // Increase brightness
                brightnessSlider.value = Math.min(parseInt(brightnessSlider.value) + step, brightnessSlider.max);
                break;
            case 'ArrowDown':
                // Decrease brightness
                brightnessSlider.value = Math.max(parseInt(brightnessSlider.value) - step, brightnessSlider.min);
                break;
            case 'ArrowRight':
                // Increase contrast
                contrastSlider.value = Math.min(parseInt(contrastSlider.value) + step, contrastSlider.max);
                break;
            case 'ArrowLeft':
                // Decrease contrast
                contrastSlider.value = Math.max(parseInt(contrastSlider.value) - step, contrastSlider.min);
                break;
            case 'r':
            case 'R':
                // Reset to default
                resetToDefault();
                break;
            case 's':
            case 'S':
                // Save settings
                saveSettings();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                // Apply presets using number keys
                const presetButtons = document.querySelectorAll('.preset-button');
                const presetIndex = parseInt(e.key) - 1;
                if (presetButtons[presetIndex]) {
                    presetButtons[presetIndex].click();
                }
                break;
            default:
                return; // Exit for other keys
        }
        
        // Update slider values and apply filters
        updateSliderValues();
        applyFilters();
        
        // Add audio feedback
        playAudioFeedback('key');
        
        // Prevent default action (like page scrolling)
        e.preventDefault();
    });
}

function updateSliderValues() {
    const brightnessSlider = document.getElementById('brightness');
    const contrastSlider = document.getElementById('contrast');
    const saturationSlider = document.getElementById('saturation');
    const temperatureSlider = document.getElementById('temperature');
    
    // Update displayed values next to sliders
    brightnessSlider.nextElementSibling.textContent = `${brightnessSlider.value}%`;
    contrastSlider.nextElementSibling.textContent = `${contrastSlider.value}%`;
    saturationSlider.nextElementSibling.textContent = `${saturationSlider.value}%`;
    temperatureSlider.nextElementSibling.textContent = `${temperatureSlider.value}K`;
}

function applyFilters() {
    const brightnessValue = document.getElementById('brightness').value;
    const contrastValue = document.getElementById('contrast').value;
    const saturationValue = document.getElementById('saturation').value;
    const temperatureValue = document.getElementById('temperature').value;
    
    // Calculate color temperature adjustment (simplified)
    const temperatureNormalized = (temperatureValue - 6500) / 1000;
    const redTint = temperatureNormalized < 0 ? 1 : 1 - temperatureNormalized * 0.1;
    const blueTint = temperatureNormalized > 0 ? 1 : 1 + temperatureNormalized * 0.1;
    
    // Apply filters to reference image
    const referenceImage = document.getElementById('reference-image');
    referenceImage.style.filter = `
        brightness(${brightnessValue / 100})
        contrast(${contrastValue / 100})
        saturate(${saturationValue / 100})
    `;
    
    // Apply color temperature using a subtle overlay
    let tempOverlay = referenceImage.querySelector('.temp-overlay');
    if (!tempOverlay) {
        tempOverlay = document.createElement('div');
        tempOverlay.className = 'temp-overlay';
        tempOverlay.style.position = 'absolute';
        tempOverlay.style.top = '0';
        tempOverlay.style.left = '0';
        tempOverlay.style.width = '100%';
        tempOverlay.style.height = '100%';
        tempOverlay.style.pointerEvents = 'none';
        tempOverlay.style.mixBlendMode = 'color';
        referenceImage.style.position = 'relative';
        referenceImage.appendChild(tempOverlay);
    }
    
    // Set color based on temperature
    tempOverlay.style.backgroundColor = `rgba(
        ${Math.round(255 * redTint)},
        ${Math.round(255 * (1 - Math.abs(temperatureNormalized) * 0.1))},
        ${Math.round(255 * blueTint)},
        ${Math.abs(temperatureNormalized) * 0.3}
    )`;
    
    // Apply same filter to the entire document body for a full-screen effect
    document.body.style.filter = `
        brightness(${brightnessValue / 100})
        contrast(${contrastValue / 100})
        saturate(${saturationValue / 100})
    `;
    
    // Apply color temperature to body
    document.body.style.backgroundColor = temperatureNormalized < 0 ? 
        `rgba(255, ${Math.round(255 * (1 - Math.abs(temperatureNormalized) * 0.05))}, ${Math.round(255 * (1 - Math.abs(temperatureNormalized) * 0.1))}, 0.2)` : 
        `rgba(${Math.round(255 * (1 - temperatureNormalized * 0.1))}, ${Math.round(255 * (1 - temperatureNormalized * 0.05))}, 255, 0.2)`;
}

function resetToDefault() {
    // Reset sliders to default values
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('saturation').value = 100;
    document.getElementById('temperature').value = 6500;
    
    // Update displayed values
    updateSliderValues();
    
    // Apply filters
    applyFilters();
    
    // Remove active class from presets
    document.querySelectorAll('.preset-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add audio feedback
    playAudioFeedback('reset');
}

function saveSettings() {
    // Get current settings
    const settings = {
        brightness: document.getElementById('brightness').value,
        contrast: document.getElementById('contrast').value,
        saturation: document.getElementById('saturation').value,
        temperature: document.getElementById('temperature').value
    };
    
    // Save to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const scenario = urlParams.get('scenario') || 'gaming';
    localStorage.setItem(`displayPerfect_${scenario}`, JSON.stringify(settings));
    
    // Show saved notification
    const notification = document.querySelector('.settings-saved-notification');
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
    
    // Add audio feedback
    playAudioFeedback('save');
}

function loadSavedSettings(scenario) {
    // Try to load saved settings from localStorage
    const savedSettings = localStorage.getItem(`displayPerfect_${scenario}`);
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings
            document.getElementById('brightness').value = settings.brightness || 100;
            document.getElementById('contrast').value = settings.contrast || 100;
            document.getElementById('saturation').value = settings.saturation || 100;
            document.getElementById('temperature').value = settings.temperature || 6500;
            
            // Update displayed values
            updateSliderValues();
            
            // Apply filters
            applyFilters();
        } catch (e) {
            console.error('Error loading saved settings:', e);
        }
    }
}

// Audio feedback functions
function playAudioFeedback(type) {
    // Create audio context on first use
    if (!window.audioContext) {
        try {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported:', e);
            return;
        }
    }
    
    const ctx = window.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Different sounds for different actions
    switch(type) {
        case 'click':
            oscillator.type = 'sine';
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.1;
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
            break;
        case 'slide':
            oscillator.type = 'sine';
            oscillator.frequency.value = 330;
            gainNode.gain.value = 0.05;
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.05);
            break;
        case 'key':
            oscillator.type = 'sine';
            oscillator.frequency.value = 523;
            gainNode.gain.value = 0.05;
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.05);
            break;
        case 'save':
            oscillator.type = 'sine';
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.1;
            oscillator.start(ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
            oscillator.stop(ctx.currentTime + 0.3);
            break;
        case 'reset':
            oscillator.type = 'square';
            oscillator.frequency.value = 330;
            gainNode.gain.value = 0.1;
            oscillator.start(ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
            oscillator.stop(ctx.currentTime + 0.3);
            break;
    }
}

// Reference image generation functions
function createGamingReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create gradient bars from dark to light
    const gradientWidth = Math.min(canvas.width * 0.8, 800);
    const gradientHeight = 30;
    const startX = centerX - gradientWidth / 2;
    
    for (let i = 0; i < 5; i++) {
        const y = centerY - 100 + i * (gradientHeight + 20);
        
        const gradient = ctx.createLinearGradient(startX, y, startX + gradientWidth, y);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.2, '#0a0a0a');
        gradient.addColorStop(0.4, '#1a1a1a');
        gradient.addColorStop(0.6, '#4d4d4d');
        gradient.addColorStop(0.8, '#808080');
        gradient.addColorStop(1, '#f0f0f0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, y, gradientWidth, gradientHeight);
    }
    
    // Draw hard to see enemy silhouette in dark area
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(startX + gradientWidth * 0.1, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
}

function createReadingReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // White background for reading
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Sample text with varying sizes
    ctx.fillStyle = '#000';
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Adjust for comfortable reading', centerX, centerY - 200);
    
    ctx.font = '20px sans-serif';
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    
    // Wrap text
    wrapText(ctx, text, centerX, centerY - 100, 600, 30);
    
    // Different font sizes
    const fontSizes = [12, 14, 16, 18, 20, 22, 24];
    let y = centerY + 50;
    
    fontSizes.forEach(size => {
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(`This text is ${size}px in size. Ensure it's comfortable to read.`, centerX, y);
        y += size + 10;
    });
}

function createOfficeReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Light background
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw spreadsheet-like grid
    const gridWidth = Math.min(canvas.width * 0.8, 800);
    const gridHeight = 400;
    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Draw columns
    const colCount = 10;
    for (let i = 0; i <= colCount; i++) {
        const x = startX + (gridWidth / colCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY + gridHeight);
        ctx.stroke();
    }
    
    // Draw rows
    const rowCount = 20;
    for (let i = 0; i <= rowCount; i++) {
        const y = startY + (gridHeight / rowCount) * i;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + gridWidth, y);
        ctx.stroke();
    }
    
    // Add some sample data
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    const headers = ['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total', 'Average', 'Min', 'Max'];
    const cellWidth = gridWidth / colCount;
    
    headers.forEach((header, i) => {
        ctx.fillText(header, startX + cellWidth/2 + i * cellWidth, startY + 25);
    });
}

function createVideosReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Vibrant background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff416c');
    gradient.addColorStop(1, '#ff4b2b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw video player-like interface
    const playerWidth = Math.min(canvas.width * 0.8, 800);
    const playerHeight = 450;
    const startX = centerX - playerWidth / 2;
    const startY = centerY - playerHeight / 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(startX, startY, playerWidth, playerHeight);
    
    // Colorful elements
    const colors = ['#FF5E7E', '#47A8BD', '#FFDA77', '#9649CB', '#79D45E'];
    const elementWidth = playerWidth / colors.length - 20;
    const elementHeight = playerHeight - 80;
    
    colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(startX + 10 + i * (elementWidth + 20), startY + 40, elementWidth, elementHeight);
    });
}

function createMoviesReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Black background for cinematic look
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Cinema aspect ratio bars
    const barHeight = canvas.height * 0.12;
    ctx.fillRect(0, 0, canvas.width, barHeight);
    ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
    
    // Dark scene with subtle details
    const sceneWidth = Math.min(canvas.width * 0.8, 800);
    const sceneHeight = canvas.height - barHeight * 2 - 40;
    const startX = centerX - sceneWidth / 2;
    const startY = barHeight + 20;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(startX, startY, sceneWidth, sceneHeight);
    
    // Stars/lights in dark scene
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 200; i++) {
        const x = startX + Math.random() * sceneWidth;
        const y = startY + Math.random() * sceneHeight;
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.9 + 0.1;
        
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Shadowy figure
    ctx.fillStyle = '#181818';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Add subtle silhouette details
    ctx.fillStyle = '#202020';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 70, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.rect(centerX - 40, centerY, 80, 100);
    ctx.fill();
}

// Helper function to wrap text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    
    context.textAlign = 'center';
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    
    context.fillText(line, x, y);
} 