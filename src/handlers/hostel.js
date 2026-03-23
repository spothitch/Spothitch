/**
 * Hostel Recommendation Handlers
 * Add, upvote, switch category for hostel recommendations
 */

// Hostel recommendations handlers
window.openAddHostel = async (city) => {
  const { renderAddHostelForm } = await import('../services/hostelRecommendations.js');
  const formHTML = renderAddHostelForm(city);
  const existingModal = document.getElementById('hostel-modal');
  if (existingModal) existingModal.remove();

  const modalDiv = document.createElement('div');
  modalDiv.id = 'hostel-modal';
  modalDiv.innerHTML = formHTML;
  document.body.appendChild(modalDiv);
};

window.closeAddHostel = () => {
  const modal = document.getElementById('hostel-modal');
  if (modal) modal.remove();
};

window.setHostelCategory = (category) => {
  // Update selected category
  const catEl = document.getElementById('selected-category')
  if (catEl) catEl.value = category;

  // Update button styles
  document.querySelectorAll('.category-btn').forEach(btn => {
    if (btn.dataset.category === category) {
      btn.className = 'category-btn py-3 px-2 rounded-xl text-center transition-colors border-2 border-primary-500 bg-primary-500/20';
    } else {
      btn.className = 'category-btn py-3 px-2 rounded-xl text-center transition-colors border border-white/10 hover:border-primary-500';
    }
  });
};

window.submitHostelRec = async (city) => {
  if (window.submitHostelRec._busy) return
  window.submitHostelRec._busy = true
  setTimeout(() => { window.submitHostelRec._busy = false }, 2000)
  const t = window.t
  const { scheduleRender } = window._appInternals
  const hostelName = document.getElementById('hostel-name')?.value?.trim();
  const category = document.getElementById('selected-category')?.value;

  if (!hostelName) {
    window.showToast(t('enterHostelName') || 'Veuillez entrer le nom de l\'auberge', 'warning');
    return;
  }

  if (!category) {
    window.showToast(t('selectCategory') || 'Veuillez sélectionner une catégorie', 'warning');
    return;
  }

  const { addRecommendation } = await import('../services/hostelRecommendations.js');
  const success = addRecommendation(city, hostelName, category);

  if (success) {
    window.closeAddHostel();
    // Re-render to show new recommendation
    scheduleRender(() => window._appInternals.render());
  }
};

window.upvoteHostel = async (city, hostelName) => {
  const { scheduleRender } = window._appInternals
  const { upvoteRecommendation } = await import('../services/hostelRecommendations.js');
  const success = upvoteRecommendation(city, hostelName);

  if (success) {
    // Re-render to update upvote count
    scheduleRender(() => window._appInternals.render());
  }
};

window.switchHostelCategory = async (category, cityName) => {
  const { switchHostelCategory } = await import('../services/hostelRecommendations.js');
  switchHostelCategory(category, cityName);
};
