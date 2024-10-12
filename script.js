document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        fetchGitHubProfile(username);
    }
});

async function fetchGitHubProfile(username) {
    const profileContainer = document.getElementById('profile');
    profileContainer.innerHTML = '<p>Loading...</p>';
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
            throw new Error('User not found');
        }
        const userData = await userResponse.json();

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const reposData = await reposResponse.json();

        const followersResponse = await fetch(`https://api.github.com/users/${username}/followers`);
        const followersData = await followersResponse.json();

        displayProfile(userData, reposData, followersData);
    } catch (error) {
        profileContainer.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayProfile(userData, reposData, followersData) {
    const profileContainer = document.getElementById('profile');
    profileContainer.innerHTML = `
        <div class="profile-card">
            <img src="${userData.avatar_url}" alt="${userData.login} avatar">
            <div>
                <h2>${userData.name || 'No Name Provided'}</h2>
                <p>@${userData.login}</p>
                <p>${userData.bio || 'No bio available'}</p>
                <p>Public Repos: ${userData.public_repos}</p>
                <p>Followers: ${userData.followers}</p>
            </div>
        </div>
        <div class="profile-info">
            <h3>Repositories:</h3>
            <ul>
                ${reposData.slice(0, 5).map(repo => `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`).join('')}
            </ul>
            <h3>Followers:</h3>
            <ul>
                ${followersData.slice(0, 5).map(follower => `<li><a href="${follower.html_url}" target="_blank">${follower.login}</a></li>`).join('')}
            </ul>
        </div>
    `;
}
