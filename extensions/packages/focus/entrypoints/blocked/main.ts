const params = new URLSearchParams(location.search);
const domain = params.get('domain') ?? 'this site';

document.getElementById('app')!.innerHTML = `
  <div class="card">
    <div class="icon">🛡️</div>
    <h1>Focus mode is active</h1>
    <div class="domain">${domain}</div>
    <p>This site is on your Qeloma Focus blocklist. Close this tab and get back to what you were working on — you've got this.</p>
    <button id="close">Close tab</button>
  </div>
`;

document.getElementById('close')!.addEventListener('click', () => {
  window.close();
});
