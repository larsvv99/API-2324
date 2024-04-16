const allTriggers = document.querySelectorAll('.trigger')

if (allTriggers.length) {
    allTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const open = button.dataset.open;
            document.getElementById(open).classList.toggle('is-active');
        });
    });
}



document.addEventListener('DOMContentLoaded', function () {
    const playButtons = document.querySelectorAll('.play');

    playButtons.forEach(button => {
        const audio = document.getElementById(button.dataset.play);
        const record = button.closest('.record');

        button.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                button.style.backgroundImage = 'url("images/pause.png")';
                record.classList.add('spin');
            } else {
                audio.pause();
                button.style.backgroundImage = 'url("images/play.png")';
                record.classList.remove('spin');
            }
        });

        audio.addEventListener('ended', function () {
            button.style.backgroundImage = 'url("images/play.png")';
            record.classList.remove('spin');
        });
    });
});






