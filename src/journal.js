document.addEventListener('DOMContentLoaded', () => {
console.log("Journal page loaded.");
    loadJournalEntries();
});
function loadJournalEntries() {
    const entries = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
const container = document.getElementById('journal-container');
    if (container) {
        if (entries.length === 0) {
            container.innerHTML = '<p class="text-gray-400">No entries yet. Add your first movie please!</p>';
            return;
        }
    container.innerHTML = entries.map(entry => `
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 class="text-xl font-bold text-yellow-500">${entry.title}</h3>
        <p class="text-gray-300">${entry.review}</p>
        </div>
    `).join('');
    }
}
document.addEventListener('DOMContentLoaded', loadJournalEntries);
        
