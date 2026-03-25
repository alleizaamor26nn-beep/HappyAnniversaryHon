document.addEventListener("DOMContentLoaded", () => {

    // ================= 💌 MODAL =================
    const modal = document.getElementById('love-modal');
    const modalText = document.getElementById('modal-text');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.getElementById('close-modal');

    function showModal(title, text) {
        modalTitle.innerHTML = title;
        modalText.innerHTML = text;
        modal.classList.remove('hidden');
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => modal.classList.add('hidden');
    }

    // ================= 🎵 MUSIC =================
    const bgMusic = document.getElementById('bg-music');
    document.addEventListener('click', () => {
        if (bgMusic && bgMusic.paused) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(() => {});
        }
    }, { once: true });

    // ================= 💖 HEARTS =================
    const heartsContainer = document.getElementById('hearts-container');
    function createHeart() {
        if (!heartsContainer) return;
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = "💖";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (16 + Math.random() * 20) + "px";
        heart.style.animationDuration = (3 + Math.random() * 3) + "s";
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }
    setInterval(createHeart, 400);

    // ================= 💬 CHAT =================
    const chatMessages = [
        "Galingan mo honey!",
        "Yan na ba yon?",
        "Awit, di mo na ba ko mahal?",
        "Ganito lang ba kalakas pagmamahal mo?"
    ];
    const chatBox = document.getElementById('chat-message');

    function updateChat() {
        if (!game.game_over()) {
            chatBox.textContent = chatMessages[Math.floor(Math.random() * chatMessages.length)];
        }
    }

    // ================= ⏱️ TIMER =================
    const timerDisplay = document.getElementById('timer-display');
    let startTime = null;

    function updateTimer() {
        if (!startTime) return;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        timerDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    }
    setInterval(updateTimer, 1000);

    // ================= ♟️ CHESS =================
    const chessboard = document.getElementById('chessboard');

    const pieceEmojis = {
        'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
        'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
    };

    let game = new Chess();
    let selectedSquare = null;
    let legalMoves = [];
    let hardMode = false;

    function renderBoard() {
        chessboard.innerHTML = '';
        const board = game.board();

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                square.classList.add('square');

                const lightColor = hardMode ? '#1E1E2F' : '#fff0f5';
                const darkColor = hardMode ? '#0D4F8B' : '#ffb3d9';
                square.style.backgroundColor = (r + c) % 2 === 0 ? lightColor : darkColor;

                const piece = board[r][c];
                square.textContent = piece
                    ? pieceEmojis[piece.color === 'w'
                        ? piece.type.toUpperCase()
                        : piece.type]
                    : '';

                square.dataset.row = r;
                square.dataset.col = c;

                square.onclick = () => handleClick(r, c);
                chessboard.appendChild(square);
            }
        }
        highlightLegal();
    }

    function highlightLegal() {
        document.querySelectorAll('.square').forEach(sq => sq.classList.remove('highlight'));
        legalMoves.forEach(move => {
            const sq = document.querySelector(`.square[data-row='${move.to[0]}'][data-col='${move.to[1]}']`);
            if (sq) sq.classList.add('highlight');
        });
    }

    function handleClick(row, col) {
        const board = game.board();
        const piece = board[row][col];

        if (selectedSquare && legalMoves.some(m => m.to[0] === row && m.to[1] === col)) {
            game.move({
                from: `${String.fromCharCode(97 + selectedSquare[1])}${8 - selectedSquare[0]}`,
                to: `${String.fromCharCode(97 + col)}${8 - row}`,
                promotion: 'q'
            });
            selectedSquare = null;
            legalMoves = [];
            renderBoard();
            updateChat();
            setTimeout(aiMove, 300);
        } else if (piece && piece.color === 'w') {
            selectedSquare = [row, col];
            const moves = game.moves({
                square: `${String.fromCharCode(97 + col)}${8 - row}`,
                verbose: true
            });
            legalMoves = moves.map(m => ({
                to: [8 - parseInt(m.to[1]), m.to.charCodeAt(0) - 97]
            }));
            highlightLegal();
        } else {
            selectedSquare = null;
            legalMoves = [];
            highlightLegal();
        }
    }

    // ================= 🤖 AI =================
    function aiMove() {
        if (game.game_over()) return checkGameOver();

        let moves = game.moves({ verbose: true });
        let move;

        if (hardMode) {
            const aggressive = moves.filter(m => m.captured || m.san.includes('+'));
            move = aggressive.length
                ? aggressive[Math.floor(Math.random() * aggressive.length)]
                : moves[Math.floor(Math.random() * moves.length)];
        } else {
            move = moves[Math.floor(Math.random() * moves.length)];
        }

        game.move(move);
        renderBoard();
        updateChat();
        checkGameOver();
    }

    // ================= GAME OVER =================
    function checkGameOver() {
        if (game.in_checkmate()) {

            if (game.turn() === 'b') { // Player won normal mode
                for (let i = 0; i < 30; i++) setTimeout(createHeart, i * 50);

                if (!hardMode) {
                    // Show Love Letter 💌
                    showModal(
                        "💌 Love Letter 💌",
                        `Congrats my love! ❤️<br><br>
                         You checkmated me...<br>
                         Happy 2nd Anniversary my king, king-in... 💖♟️<br><br>
                         I want to take this opportunity to tell you my appreciation if
                     havent or made you feel appreciated . First I wanna tell you 
                     that i am very thankful and lucky to have you in mah life specially
                     on difficult times. you always support me kahit mahirap ako kausap
                     palagi
                    <br><br>
                     i am learning a lot from you and i am also very thankful for that
                     not just as a person but as an IT proffesional, you my dark to my dark
                     instead of light cauze you have dark skin , yeah i know im a raisins 
                     AHAHAHHA but i really appreciate your pressence from the 
                     very beningging. And i didnt just realized that now.
                    <br><br>
                     because i always do appreciate you and admire everything you do like 
                     for example yung pagsasabay sabay mo ng bagay pag aaral, pagtatrabaho 
                     isip mo pa yung monthsary, anniversary and birthday ko 
                     sa family mo, i know kinakaya mo lahat yan and you always bring me smile
                     and never forget our nightly routine na maglaro kahit tagtag kana sa school
                     at sa work. i also admire how you know things better than me which kinda 
                     annoy me sometimes well i cant blame you cause you had a lot of expirience 
                     and i dont have any expirience on working ever since.
                    <br><br>
                     i also appreciate how you always update me what you doin, where you at, and your
                     other plans thank you for being consistent on that, thank you for always doing things
                     for me and helping me almost everyday, i know that its exhausting for you so im sorry
                     for that. 
                    <br><br>
                     and lastly i wanted to appreciate you doing better this past few months wag mo lang isama
                     yung kahapon, and making things easier for me, even though i am difficult to deal with
                     i hope we continue loving each other, specially on fights and continue to be better
                    <br><br>
                     cuz remember happy wife, happy____?
                     welp i think that's all if you have further question or clarification feel 
                     free to modify this message to your likings, i'm here to help you.
                    <br><br>
                     chariz, I LOVE YOU JONATS OLD STYLE FRIED CHICKEN SARAP NA GUSTO MO
                     HAPPY ANNIVERSARY
                    <br><br>
                     FROM YOUR ONE AND ONLY YOURS TRULLY,
                     ME, ALLEIZA AMOR
<br>
                         <button id="rant-btn">Wanna hear my rant?</button>`
                    );

                    document.getElementById('rant-btn').onclick = () => {
                        modal.classList.add('hidden');
                        startHardMode();
                    };

                } else {
                    endTimer();
                }

            } else {
                showModal("😢 Game Over 😢", "I checkmated you...");
            }
        }
    }

    // ================= HARD MODE FLOW =================
    function startHardMode() {
        hardMode = true;
        renderBoard();

        showModal(
            "⚠️ Hard Mode Activated ⚠️",
            `<button id="continue-challenge">Continue</button>`
        );

        document.getElementById('continue-challenge').onclick = () => {
            modal.classList.add('hidden');
            showTerms();
        };
    }

    function showTerms() {
        showModal(
            "📜 Terms & Conditions 📜",
            `1. Checkmate opponent to get a prize.<br>
             2. Time matters:<br>
             - >30 min = no reward<br>
             - ≤30 min = Softdrink at Dali<br>
             - ≤20 min = French Fries<br>
             - ≤10 min = Mix & Match of choice<br><br>
             <button id="start-timer-btn">Ready?</button>`
        );

        document.getElementById('start-timer-btn').onclick = () => {
            modal.classList.add('hidden');

            // ✅ NEW: Reset game and enable hard mode AI
            game.reset();
            selectedSquare = null;
            legalMoves = [];
            hardMode = true;
            renderBoard();

            startTime = Date.now();
            timerDisplay.classList.remove('hidden');
        };
    }

    function endTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        let prize = "No reward 💌";
        if (elapsed <= 600) prize = "Mix & Match 🍟🥤🍫";
        else if (elapsed <= 1200) prize = "French Fries 🍟";
        else if (elapsed <= 1800) prize = "Softdrink 🥤";

        showModal(
            "🏆 Challenge Completed 🏆",
            `You finished in <b>${Math.floor(elapsed / 60)} min ${elapsed % 60} sec</b>.<br>
             Your prize: <b>${prize}</b><br><br>
             <b>💢 My Rant 💢</b><br>
             So eto na nga... 😤<br><br>
             Ang tagal mo bago ako ma-checkmate...<br>
             Ganito lang ba kalakas pagmamahal mo? 😭<br><br>
             Happy 2nd Anniversary Jonathan!<br><br>
             Dipa rin ako sanay na tawagin kang honey, sorry i know na halos lahat ng 
             love letter na nabigay ko sayo is halos dinakaaya-aya, feeling ko  
             kaya i stop doing it. i feel like  it just gave you head acge  please
             tell me otherwise and why cuz i wanna know how you feel with every move.
            <br><br>
             i really wanted to make this to be full of love but i feel like my love 
             is just drama for you, which it makes it more difficult, like i wanna show
             and make you feel what i feel , so you realize i wanted to communicate and
             connected, isnt that a great thing? but you always make me feel that its just
             a nuissance or somethin. i feel like you think that it just stressed you out.
            <br><br>
             it makes me cry thinking we dont have the same idea of love  like  i feel like 
             you want a woman that is secure and doesnt cling to you all the time and have her
             own life which i may not have.
            <br><br>
             i also thinks about how you easilysay such things to melike it didnt even make you 
             think you twice then youre going to be annoyed why cant i trust you. its because you
             cant even stop yourself from saying such awful things. am i paranoid? or did i really 
             hear you say things like that to me? tell me.
            <br><br>
             i hope this to be fixed soon cause i wanted 
             our relationship to work if that'll be fine. 
             i want to be rest-assured that this will never
             happened again in the difficult times. and i 
             demand an explanation of all bad things you say to me. 
             i dont know what you said but the feelings is in me
             and it bothers me and will bothers me specially in difficult times.

             
            <br><br>
`
        );

        startTime = null;
    }

    // ================= RESET =================
    document.getElementById('reset-btn').onclick = () => {
        game.reset();
        selectedSquare = null;
        legalMoves = [];
        hardMode = false;
        startTime = null;
        timerDisplay.classList.add('hidden');
        renderBoard();
    };

    // ================= INIT =================
    renderBoard();
});