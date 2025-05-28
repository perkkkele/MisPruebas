
interface Phase {
    id: string;
    text: string;
    status: 'neutral' | 'correct' | 'incorrect' | 'revealed';
}

const PHASES_TEXT: string[] = [
    "Problema",
    "Investigación",
    "Soluciones posibles",
    "Planificación",
    "Diseño",
    "Solución elegida",
    "Construcción",
    "Comprobación",
    "Presentación y evaluación",
    "Memoria"
];

const CORRECT_ORDER: string[] = [
    "Problema",
    "Investigación",
    "Soluciones posibles",
    "Solución elegida",
    "Diseño",
    "Planificación",
    "Construcción",
    "Comprobación",
    "Presentación y evaluación",
    "Memoria"
];

const MAX_ATTEMPTS = 3;

let currentPhases: Phase[] = [];
let attemptsLeft: number = MAX_ATTEMPTS;
let draggedItemElement: HTMLElement | null = null;
let gameEnded: boolean = false;

const phasesListElement = document.getElementById('phases-list') as HTMLUListElement;
const checkButtonElement = document.getElementById('check-button') as HTMLButtonElement;
const resetButtonElement = document.getElementById('reset-button') as HTMLButtonElement;
const attemptsCountElement = document.getElementById('attempts-count') as HTMLSpanElement;
const feedbackMessageElement = document.getElementById('feedback-message') as HTMLDivElement;

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function renderPhases(): void {
    phasesListElement.innerHTML = '';
    currentPhases.forEach((phase, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('phase-item');
        listItem.textContent = `${index + 1}. ${phase.text}`; // Add numbering for display
        listItem.dataset.id = phase.id;
        listItem.draggable = !gameEnded;
        
        listItem.classList.remove('correct', 'incorrect', 'revealed', 'neutral');
        listItem.classList.add(phase.status);

        if (!gameEnded) {
            listItem.addEventListener('dragstart', handleDragStart);
            listItem.addEventListener('dragover', handleDragOver);
            listItem.addEventListener('drop', handleDrop);
            listItem.addEventListener('dragend', handleDragEnd);
            listItem.addEventListener('dragenter', handleDragEnter);
            listItem.addEventListener('dragleave', handleDragLeave);
        } else {
            listItem.style.cursor = 'default';
        }
        phasesListElement.appendChild(listItem);
    });
    updateAttemptsDisplay();
}

function handleDragStart(event: DragEvent): void {
    draggedItemElement = event.target as HTMLElement;
    if (draggedItemElement && event.dataTransfer) {
        event.dataTransfer.setData('text/plain', draggedItemElement.dataset.id!);
        event.dataTransfer.effectAllowed = 'move';
        draggedItemElement.classList.add('dragging');
    }
}

function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
}

function handleDragEnter(event: DragEvent): void {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('phase-item') && targetElement !== draggedItemElement) {
        targetElement.classList.add('drag-over');
    }
}

function handleDragLeave(event: DragEvent): void {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('phase-item')) {
        targetElement.classList.remove('drag-over');
    }
}

function handleDrop(event: DragEvent): void {
    event.preventDefault();
    const targetItemElement = (event.target as HTMLElement).closest('.phase-item') as HTMLElement;
    targetItemElement.classList.remove('drag-over');

    if (!draggedItemElement || !targetItemElement || draggedItemElement === targetItemElement) {
        return;
    }

    const draggedId = draggedItemElement.dataset.id!;
    const targetId = targetItemElement.dataset.id!;

    const draggedIndex = currentPhases.findIndex(p => p.id === draggedId);
    const targetIndex = currentPhases.findIndex(p => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedPhase] = currentPhases.splice(draggedIndex, 1);
    currentPhases.splice(targetIndex, 0, draggedPhase);
    
    // Reset status on reorder before check
    currentPhases.forEach(p => p.status = 'neutral');
    clearFeedbackMessage();
    renderPhases();
}

function handleDragEnd(): void {
    if (draggedItemElement) {
        draggedItemElement.classList.remove('dragging');
    }
    draggedItemElement = null;
    // Clean up any stray drag-over classes
    document.querySelectorAll('.phase-item.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function updateAttemptsDisplay(): void {
    attemptsCountElement.textContent = attemptsLeft.toString();
}

function displayFeedbackMessage(message: string, type: 'success' | 'error' | 'info'): void {
    feedbackMessageElement.textContent = message;
    feedbackMessageElement.className = 'feedback-message'; // Reset classes
    feedbackMessageElement.classList.add(type);
}

function clearFeedbackMessage(): void {
    feedbackMessageElement.textContent = '';
    feedbackMessageElement.className = 'feedback-message';
}

function checkOrder(): void {
    if (gameEnded || attemptsLeft <= 0) return;

    attemptsLeft--;
    let allCorrect = true;

    currentPhases.forEach((phase, index) => {
        if (phase.text === CORRECT_ORDER[index]) {
            phase.status = 'correct';
        } else {
            phase.status = 'incorrect';
            allCorrect = false;
        }
    });

    renderPhases();

    if (allCorrect) {
        displayFeedbackMessage('¡Felicidades! Has ordenado correctamente todas las fases.', 'success');
        gameEnded = true;
        checkButtonElement.disabled = true;
    } else if (attemptsLeft <= 0) {
        displayFeedbackMessage('Has agotado tus intentos. El orden correcto se muestra a continuación.', 'error');
        gameEnded = true;
        checkButtonElement.disabled = true;
        revealCorrectOrder();
    } else {
        displayFeedbackMessage(`Incorrecto. Te quedan ${attemptsLeft} intento(s).`, 'info');
    }
}

function revealCorrectOrder(): void {
    const correctlyOrderedPhases: Phase[] = [];
    CORRECT_ORDER.forEach(correctText => {
        const foundPhase = PHASES_TEXT.find(pText => pText === correctText); // Find from original texts
        if (foundPhase) {
            correctlyOrderedPhases.push({
                id: foundPhase, // Use text as ID for simplicity here
                text: foundPhase,
                status: 'revealed' // Mark as revealed
            });
        }
    });
    currentPhases = correctlyOrderedPhases;
    gameEnded = true; // Ensure drag is disabled
    renderPhases();
}


function resetExercise(): void {
    attemptsLeft = MAX_ATTEMPTS;
    gameEnded = false;
    
    const shuffledTexts = shuffleArray(PHASES_TEXT);
    currentPhases = shuffledTexts.map(text => ({
        id: text, // Use text as ID for simplicity
        text: text,
        status: 'neutral'
    }));

    checkButtonElement.disabled = false;
    clearFeedbackMessage();
    renderPhases();
}

function initializeApp(): void {
    checkButtonElement.addEventListener('click', checkOrder);
    resetButtonElement.addEventListener('click', resetExercise);
    resetExercise(); // Initial setup
}

// Start the application
initializeApp();
