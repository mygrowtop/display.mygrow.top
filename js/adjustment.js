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
}

// Scenario configurations
const scenarioConfigs = {
    gaming: {
        title: 'Gaming Display Optimization',
        description: 'Adjust your display for the best gaming experience with optimal visibility in dark scenes.',
        referenceImage: createGamingReferenceImage,
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
        });
    });
    
    // Initialize displayed values
    updateSliderValues();
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
}

// Reference image generation functions
function createGamingReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient from dark to light
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.4, '#1a1a1a');
    gradient.addColorStop(0.7, '#4d4d4d');
    gradient.addColorStop(1, '#f0f0f0');
    
    // Draw gradient bars
    ctx.fillStyle = gradient;
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(50, 50 + i * 40, 400, 20);
    }
    
    // Draw hard to see enemy silhouette in dark area
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(100, 150, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Text instructions
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Adjust until you can see the circle in the dark area', 150, 280);
}

function createReadingReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // White background for reading
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Sample text with varying sizes
    ctx.fillStyle = '#000';
    ctx.font = '20px serif';
    ctx.fillText('Adjust for comfortable reading', 50, 50);
    
    ctx.font = '14px sans-serif';
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    
    // Wrap text
    wrapText(ctx, text, 50, 80, 400, 20);
}

function createOfficeReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Light background
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw spreadsheet-like grid
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    for (let x = 50; x <= 450; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, 250);
        ctx.stroke();
    }
    
    for (let y = 50; y <= 250; y += 25) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(450, y);
        ctx.stroke();
    }
    
    // Add some sample data
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    
    const headers = ['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'];
    headers.forEach((header, i) => {
        ctx.fillText(header, 60 + i * 50, 70);
    });
}

function createVideosReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Vibrant background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff416c');
    gradient.addColorStop(1, '#ff4b2b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw video player-like interface
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(50, 50, 400, 200);
    
    // Colorful elements
    const colors = ['#FF5E7E', '#47A8BD', '#FFDA77', '#9649CB', '#79D45E'];
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(75 + i * 75, 100, 50, 100);
    }
}

function createMoviesReferenceImage(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Black background for cinematic look
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cinema aspect ratio bars
    ctx.fillRect(0, 0, canvas.width, 40);
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    
    // Dark scene with subtle details
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(75, 70, 350, 160);
    
    // Stars/lights in dark scene
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = 75 + Math.random() * 350;
        const y = 70 + Math.random() * 160;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Shadowy figure
    ctx.fillStyle = '#181818';
    ctx.beginPath();
    ctx.arc(250, 150, 30, 0, Math.PI * 2);
    ctx.fill();
}

// Helper function to wrap text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

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