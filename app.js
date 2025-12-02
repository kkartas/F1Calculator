// ===================================
// F1 2025 CHAMPIONSHIP DATA
// ===================================

const POINTS_SYSTEM = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
};

const DRIVERS_DATA = [
    // Championship Contenders
    { id: 'norris', name: 'Lando Norris', number: 4, team: 'McLaren', teamClass: 'mclaren', currentPoints: 408 },
    { id: 'verstappen', name: 'Max Verstappen', number: 1, team: 'Red Bull', teamClass: 'redbull', currentPoints: 396 },
    { id: 'piastri', name: 'Oscar Piastri', number: 81, team: 'McLaren', teamClass: 'mclaren', currentPoints: 392 },

    // Other Drivers (2025 Grid - Actual Lineup)
    { id: 'leclerc', name: 'Charles Leclerc', number: 16, team: 'Ferrari', teamClass: 'ferrari' },
    { id: 'sainz', name: 'Carlos Sainz', number: 55, team: 'Williams', teamClass: 'williams' },
    { id: 'russell', name: 'George Russell', number: 63, team: 'Mercedes', teamClass: 'mercedes' },
    { id: 'hamilton', name: 'Lewis Hamilton', number: 44, team: 'Ferrari', teamClass: 'ferrari' },
    { id: 'alonso', name: 'Fernando Alonso', number: 14, team: 'Aston Martin', teamClass: 'aston' },
    { id: 'tsunoda', name: 'Yuki Tsunoda', number: 22, team: 'Red Bull', teamClass: 'redbull' },
    { id: 'gasly', name: 'Pierre Gasly', number: 10, team: 'Alpine', teamClass: 'alpine' },
    { id: 'hulkenberg', name: 'Nico Hülkenberg', number: 27, team: 'Sauber', teamClass: 'sauber' },
    { id: 'antonelli', name: 'Andrea Kimi Antonelli', number: 12, team: 'Mercedes', teamClass: 'mercedes' },
    { id: 'stroll', name: 'Lance Stroll', number: 18, team: 'Aston Martin', teamClass: 'aston' },
    { id: 'colapinto', name: 'Franco Colapinto', number: 43, team: 'Alpine', teamClass: 'alpine' },
    { id: 'ocon', name: 'Esteban Ocon', number: 31, team: 'Haas', teamClass: 'haas' },
    { id: 'albon', name: 'Alex Albon', number: 23, team: 'Williams', teamClass: 'williams' },
    { id: 'lawson', name: 'Liam Lawson', number: 40, team: 'RB', teamClass: 'rb' },
    { id: 'hadjar', name: 'Isack Hadjar', number: 6, team: 'RB', teamClass: 'rb' },
    { id: 'bearman', name: 'Oliver Bearman', number: 87, team: 'Haas', teamClass: 'haas' },
    { id: 'bortoleto', name: 'Gabriel Bortoleto', number: 5, team: 'Sauber', teamClass: 'sauber' },
];

// ===================================
// STATE MANAGEMENT
// ===================================

let racePositions = [...DRIVERS_DATA];

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initRaceGrid();
    calculateChampionship();
});

// ===================================
// RACE GRID RENDERING
// ===================================

function initRaceGrid() {
    const raceGrid = document.getElementById('raceGrid');
    raceGrid.innerHTML = '';

    racePositions.forEach((driver, index) => {
        const gridItem = createGridItem(driver, index + 1);
        raceGrid.appendChild(gridItem);
    });
}

function createGridItem(driver, position) {
    const isContender = ['norris', 'verstappen', 'piastri'].includes(driver.id);

    const item = document.createElement('div');
    item.className = `grid-item ${isContender ? 'contender' : ''}`;
    item.draggable = true;
    item.dataset.driverId = driver.id;

    item.innerHTML = `
        <div class="grid-position">P${position}</div>
        <div class="grid-driver-info">
            <div class="grid-driver-number">${driver.number}</div>
            <div class="grid-driver-name">${driver.name}</div>
            <div class="grid-team-badge team-${driver.teamClass}">${driver.team}</div>
        </div>
    `;

    // Drag and Drop Events (Desktop)
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    
    // Touch Events (Mobile)
    initTouchEvents(item);

    return item;
}

// ===================================
// DRAG AND DROP HANDLERS
// ===================================

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        // Get indices
        const draggedIndex = Array.from(draggedElement.parentNode.children).indexOf(draggedElement);
        const targetIndex = Array.from(this.parentNode.children).indexOf(this);

        // Move item in data (Insert instead of Swap)
        const [movedDriver] = racePositions.splice(draggedIndex, 1);
        racePositions.splice(targetIndex, 0, movedDriver);

        // Re-render grid
        initRaceGrid();
        calculateChampionship();
    }

    this.classList.remove('drag-over');
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');

    // Remove all drag-over classes
    document.querySelectorAll('.drag-over').forEach(item => {
        item.classList.remove('drag-over');
    });
}


// ===================================
// CHAMPIONSHIP CALCULATION
// ===================================

function calculateChampionship() {
    // Calculate points for each driver
    const results = racePositions.map((driver, index) => {
        const position = index + 1;
        const racePoints = POINTS_SYSTEM[position] || 0;

        return {
            ...driver,
            racePoints,
            finalPoints: (driver.currentPoints || 0) + racePoints
        };
    });

    // Get contenders
    const norris = results.find(d => d.id === 'norris');
    const verstappen = results.find(d => d.id === 'verstappen');
    const piastri = results.find(d => d.id === 'piastri');

    // Update UI
    updateLiveStandings(norris, verstappen, piastri);
}

// ===================================
// UI UPDATES
// ===================================
function updateLiveStandings(norris, verstappen, piastri) {
    // Update final points in live standings
    const norrisFinal = document.getElementById('norris-final');
    const verstappenFinal = document.getElementById('verstappen-final');
    const piastriFinal = document.getElementById('piastri-final');

    if (norrisFinal) norrisFinal.textContent = norris.finalPoints;
    if (verstappenFinal) verstappenFinal.textContent = verstappen.finalPoints;
    if (piastriFinal) piastriFinal.textContent = piastri.finalPoints;

    // Determine winner and highlight
    const maxPoints = Math.max(norris.finalPoints, verstappen.finalPoints, piastri.finalPoints);
    let winners = [norris, verstappen, piastri].filter(d => d.finalPoints === maxPoints);

    // TIE-BREAKER LOGIC: Norris wins ties due to more 2nd places
    let actualWinner = null;
    let isTieBreaker = false;

    if (winners.length > 1) {
        const norrisInTie = winners.find(d => d.id === 'norris');
        if (norrisInTie) {
            actualWinner = norrisInTie;
            isTieBreaker = true;
        }
    } else if (winners.length === 1) {
        actualWinner = winners[0];
    }

    // Reset champion class
    document.querySelectorAll('.contender-result').forEach(card => {
        card.classList.remove('champion');
    });

    // Add champion class to actual winner (or all tied if no tie-breaker applies)
    if (actualWinner) {
        document.querySelector(`.contender-result[data-driver="${actualWinner.id}"]`)?.classList.add('champion');
    } else {
        // Fallback for ties not involving Norris (e.g. Max vs Oscar)
        winners.forEach(w => {
            document.querySelector(`.contender-result[data-driver="${w.id}"]`)?.classList.add('champion');
        });
    }

    // Reorder standings based on points
    const standingsContainer = document.querySelector('.live-standings-card');
    const winnerDisplay = document.getElementById('championshipWinner');

    const contenders = [norris, verstappen, piastri].sort((a, b) => {
        if (b.finalPoints !== a.finalPoints) {
            return b.finalPoints - a.finalPoints;
        }
        // If points are equal, prioritize actualWinner
        if (actualWinner) {
            if (a.id === actualWinner.id) return -1;
            if (b.id === actualWinner.id) return 1;
        }
        return 0;
    });

    // Re-append elements in sorted order
    contenders.forEach(driver => {
        const card = document.querySelector(`.contender-result[data-driver="${driver.id}"]`);
        if (card) {
            standingsContainer.insertBefore(card, winnerDisplay);
        }
    });

    // Update championship winner display
    const championshipWinner = document.getElementById('championshipWinner');
    const winnerText = document.getElementById('winnerText');

    if (championshipWinner && winnerText) {
        if (actualWinner) {
            championshipWinner.classList.add('show');
            if (isTieBreaker) {
                winnerText.innerHTML = `${actualWinner.name} Wins! 🏆<br><span style="font-size: 0.8em; font-weight: normal;">(Tie-breaker: More 2nd Places)</span>`;
            } else {
                winnerText.textContent = `${actualWinner.name} Wins! 🏆`;
            }
        } else if (winners.length > 1) {
            // Tie between Max and Oscar (no Norris)
            championshipWinner.classList.add('show');
            winnerText.textContent = `${winners[0].name} & ${winners[1].name} Tied!`;
        }
    }
}

// ===================================
// TOUCH SUPPORT FOR MOBILE
// ===================================

let touchDragElement = null;
let touchClone = null;
let touchStartY = 0;
let touchStartX = 0;
let touchStartTime = 0;
let isDragging = false;
let dragThreshold = 10; // pixels to move before drag starts
let holdTimeout = null;
let currentDropTarget = null;
let originalIndex = -1;

// Initialize touch events on grid items
function initTouchEvents(item) {
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchmove', handleTouchMove, { passive: false });
    item.addEventListener('touchend', handleTouchEnd, { passive: false });
    item.addEventListener('touchcancel', handleTouchCancel, { passive: false });
}

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    touchDragElement = this;
    originalIndex = Array.from(this.parentNode.children).indexOf(this);
    
    // Start hold detection - 150ms for quick response
    holdTimeout = setTimeout(() => {
        startDragging(touch);
    }, 150);
}

function startDragging(touch) {
    if (!touchDragElement) return;
    
    isDragging = true;
    
    // Add dragging class to original
    touchDragElement.classList.add('dragging');
    
    // Create floating clone
    touchClone = touchDragElement.cloneNode(true);
    touchClone.classList.add('touch-dragging-clone');
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '10000';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.width = touchDragElement.offsetWidth + 'px';
    touchClone.style.left = (touch.clientX - touchDragElement.offsetWidth / 2) + 'px';
    touchClone.style.top = (touch.clientY - 30) + 'px';
    touchClone.style.transform = 'scale(1.05) rotate(2deg)';
    touchClone.style.boxShadow = '0 10px 40px rgba(225, 6, 0, 0.4)';
    touchClone.style.opacity = '0.95';
    touchClone.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    document.body.appendChild(touchClone);
    
    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function handleTouchMove(e) {
    if (!touchDragElement) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // If moved before hold timeout, cancel drag and allow scroll
    if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
        clearTimeout(holdTimeout);
        touchDragElement = null;
        return; // Allow default scroll
    }
    
    // If dragging, prevent scroll and move clone
    if (isDragging) {
        e.preventDefault();
        
        if (touchClone) {
            touchClone.style.left = (touch.clientX - touchDragElement.offsetWidth / 2) + 'px';
            touchClone.style.top = (touch.clientY - 30) + 'px';
        }
        
        // Find drop target
        const elementsUnder = document.elementsFromPoint(touch.clientX, touch.clientY);
        const dropTarget = elementsUnder.find(el => 
            el.classList.contains('grid-item') && el !== touchDragElement
        );
        
        // Update drop target highlighting
        if (currentDropTarget && currentDropTarget !== dropTarget) {
            currentDropTarget.classList.remove('drag-over');
            currentDropTarget.style.transform = '';
        }
        
        if (dropTarget && dropTarget !== currentDropTarget) {
            dropTarget.classList.add('drag-over');
            
            // Create insertion effect
            const dropIndex = Array.from(dropTarget.parentNode.children).indexOf(dropTarget);
            const items = document.querySelectorAll('.grid-item');
            
            items.forEach((item, idx) => {
                if (item === touchDragElement) return;
                if (item === dropTarget) {
                    // Show where the item will be inserted
                    if (dropIndex > originalIndex) {
                        item.style.transform = 'translateY(-4px)';
                    } else {
                        item.style.transform = 'translateY(4px)';
                    }
                } else {
                    item.style.transform = '';
                }
            });
            
            // Light haptic on target change
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
        }
        
        currentDropTarget = dropTarget;
    }
}

function handleTouchEnd(e) {
    clearTimeout(holdTimeout);
    
    if (isDragging && touchDragElement && currentDropTarget) {
        e.preventDefault();
        
        // Get indices
        const draggedIndex = Array.from(touchDragElement.parentNode.children).indexOf(touchDragElement);
        const targetIndex = Array.from(currentDropTarget.parentNode.children).indexOf(currentDropTarget);
        
        // Move item in data
        const [movedDriver] = racePositions.splice(draggedIndex, 1);
        racePositions.splice(targetIndex, 0, movedDriver);
        
        // Haptic feedback for drop
        if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
        }
        
        // Re-render grid
        initRaceGrid();
        calculateChampionship();
    }
    
    cleanupDrag();
}

function handleTouchCancel(e) {
    clearTimeout(holdTimeout);
    cleanupDrag();
}

function cleanupDrag() {
    // Remove clone
    if (touchClone && touchClone.parentNode) {
        touchClone.style.transition = 'all 0.2s ease';
        touchClone.style.opacity = '0';
        touchClone.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (touchClone && touchClone.parentNode) {
                touchClone.parentNode.removeChild(touchClone);
            }
            touchClone = null;
        }, 200);
    }
    
    // Remove dragging class
    if (touchDragElement) {
        touchDragElement.classList.remove('dragging');
    }
    
    // Remove all drag-over classes and transforms
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('drag-over');
        item.style.transform = '';
    });
    
    // Reset state
    touchDragElement = null;
    isDragging = false;
    currentDropTarget = null;
    originalIndex = -1;
}
