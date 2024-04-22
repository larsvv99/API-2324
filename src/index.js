// Open en sluiten van albums
const allTriggers = document.querySelectorAll('.trigger');

if (allTriggers.length) {
    allTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const open = button.dataset.open;
            document.getElementById(open).classList.toggle('is-active');
        });
    });
}

// Audio afspelen en plaat laten draaien
document.addEventListener('DOMContentLoaded', function () {
    const playButtons = document.querySelectorAll('.play');

    playButtons.forEach(button => {
        const audio = document.getElementById(button.dataset.play);
        const record = button.closest('.record');
        const achtergrond = document.querySelector('body');

        button.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                button.style.backgroundImage = 'url("images/pause.png")';
                record.classList.add('spin');
                achtergrond.classList.add('disco');
            } else {
                audio.pause();
                button.style.backgroundImage = 'url("images/play.png")';
                record.classList.remove('spin');
                achtergrond.classList.remove('disco');
            }
        });

        audio.addEventListener('ended', function () {
            button.style.backgroundImage = 'url("images/play.png")';
            record.classList.remove('spin');
            achtergrond.classList.remove('disco');
        });
    });
});

// Favorieten
document.querySelectorAll('.favorite-button').forEach(button => {
    button.addEventListener('click', function () {
        const albumId = this.getAttribute('data-album-id');

        document.cookie = `favoriteAlbum_${albumId}=true; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

        this.classList.add('is-favorite');
    });
});


// Favorieten verwijderen
document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function () {
        const albumId = this.getAttribute('data-album-id');
        deleteFavorite(albumId);
    });
});


// Bron: chatgpt om meerdere cookies te verwijderen
function deleteFavorite(albumId) {
    // Get all cookies
    const cookies = document.cookie.split(';');

    // Iterate over each cookie
    cookies.forEach(cookie => {
        const cookieParts = cookie.split('=');
        const cookieName = cookieParts[0].trim();

        // Check if the cookie starts with the prefix 'favoriteAlbum_'
        if (cookieName.startsWith('favoriteAlbum_')) {
            // Get the stored albumId from the cookie name
            const storedAlbumId = cookieName.substring('favoriteAlbum_'.length);

            // Compare the stored albumId with the one provided
            if (storedAlbumId === albumId) {
                // Delete the cookie by setting its expiration date to the past
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            }
        }
    });

    // Reload the page after deleting the favorite
    window.location.reload();
}


// Event listener for the refresh button
document.getElementById('refreshButton').addEventListener('click', function () {
    // Reload the page
    location.reload();
});

