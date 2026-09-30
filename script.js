// ==========================================
// ANNIVERSARY SURPRISE WEBSITE
// ==========================================


// ==========================================
// VARIABLES
// ==========================================

let currentQuestion = 0;

let score = 0;

let quizFinished = false;


// ==========================================
// QUIZ QUESTIONS
// ==========================================

const questions = [

    {
        question: "Whom do you like the most? ❤️",

        options: [
            "a) Mother",
            "b) Father",
            "c) Lover",
            "d) Relatives"
        ],

        answer: 2
    },


    {
        question: "What was the favourite food of your boyfriend? 🍚",

        options: [
            "a) Dosa",
            "b) Curd rice",
            "c) Tomato rice",
            "d) Sambar"
        ],

        answer: 3
    },


    {
        question: "What is your boyfriend date of birth? 🎂",

        options: [
            "a) 17-02-2007",
            "b) 02-01-2009",
            "c) 24-01-2007",
            "d) 07-02-2009"
        ],

        answer: 2
    },


    {
        question: "How do your boyfriend look in formal dress? 😎",

        options: [
            "a) Neat",
            "b) Attractive",
            "c) Beautiful",
            "d) Ugly"
        ],

        answer: 2
    },


    {
        question: "What is your marriage date? 💍",

        options: [
            "a) 24-01-2026",
            "b) 17-02-2026",
            "c) 27-12-2026",
            "d) 21-04-2026"
        ],

        answer: 3
    }

];


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageNumber) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(
            "page" + pageNumber
        );


    if (selectedPage) {

        selectedPage.classList.add("active");

    }

}


// ==========================================
// PAGE 1 → PAGE 2
// ==========================================

function startSurprise() {

    showPage(2);

}


// ==========================================
// PAGE 2 → PAGE 3
// SAVE ANNIVERSARY DATE
// ==========================================

async function checkDate() {

    const dateInput =
        document.getElementById(
            "anniversaryDate"
        );


    const dateError =
        document.getElementById(
            "dateError"
        );


    if (!dateInput.value) {

        dateError.textContent =
            "Please enter your anniversary date ❤️";

        return;

    }


    dateError.textContent = "";


    // Save date to backend

    try {

        const response =
            await fetch(
                "/api/anniversary",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        anniversaryDate:
                            dateInput.value
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Anniversary date saved:",
            data
        );

    }

    catch (error) {

        console.log(
            "Backend connection problem:",
            error
        );

    }


    // Reset quiz

    currentQuestion = 0;

    score = 0;

    quizFinished = false;


    // Open quiz

    showPage(3);

    loadQuestion();

}


// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    const questionText =
        document.getElementById(
            "questionText"
        );


    const optionsContainer =
        document.getElementById(
            "optionsContainer"
        );


    const questionNumber =
        document.getElementById(
            "questionNumber"
        );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    const quizFeedback =
        document.getElementById(
            "quizFeedback"
        );


    // Check elements

    if (
        !questionText ||
        !optionsContainer
    ) {

        console.error(
            "Quiz HTML elements are missing."
        );

        return;

    }


    // Current question

    const question =
        questions[currentQuestion];


    // Question number

    questionNumber.textContent =
        (currentQuestion + 1) +
        " / " +
        questions.length;


    // Question text

    questionText.textContent =
        question.question;


    // Progress

    const progress =
        ((currentQuestion + 1) /
        questions.length) * 100;


    progressBar.style.width =
        progress + "%";


    // Clear old options

    optionsContainer.innerHTML = "";


    quizFeedback.textContent = "";


    // Create options

    question.options.forEach(
        function(option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function() {

                    selectAnswer(
                        index,
                        button
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );

}


// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(
    selectedIndex,
    selectedButton
) {

    const question =
        questions[currentQuestion];


    const allButtons =
        document.querySelectorAll(
            ".quiz-option"
        );


    // Disable all buttons

    allButtons.forEach(
        function(button) {

            button.disabled = true;

        }
    );


    // Correct answer

    if (
        selectedIndex ===
        question.answer
    ) {

        score++;

        selectedButton.classList.add(
            "correct"
        );


        document.getElementById(
            "quizFeedback"
        ).textContent =
            "Correct! ❤️";

    }


    // Wrong answer

    else {

        selectedButton.classList.add(
            "wrong"
        );


        // Show correct answer

        allButtons[
            question.answer
        ].classList.add(
            "correct"
        );


        document.getElementById(
            "quizFeedback"
        ).textContent =
            "Almost! ❤️";

    }


    // Wait before next question

    setTimeout(
        function() {

            currentQuestion++;


            if (
                currentQuestion <
                questions.length
            ) {

                loadQuestion();

            }

            else {

                finishQuiz();

            }

        },
        1000
    );

}


// ==========================================
// FINISH QUIZ
// ==========================================

async function finishQuiz() {

    if (quizFinished) {
        return;
    }


    quizFinished = true;


    console.log(
        "Quiz score:",
        score
    );


    // Send score to backend

    try {

        const response =
            await fetch(
                "/api/quiz",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        score: score
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Quiz result:",
            data
        );

    }

    catch (error) {

        console.log(
            "Could not save quiz:",
            error
        );

    }


    // PASS

    if (score >= 3) {

        const finalScore =
            document.getElementById(
                "finalScore"
            );


        finalScore.textContent =
            "You got " +
            score +
            " / 5 correct! ❤️";


        setTimeout(
            function() {

                showPage(4);

            },
            500
        );

    }


    // FAIL

    else {

        const retryMessage =
            document.getElementById(
                "retryMessage"
            );


        retryMessage.textContent =
            "You got " +
            score +
            " / 5. Let's try again, my love ❤️";


        setTimeout(
            function() {

                currentQuestion = 0;

                score = 0;

                quizFinished = false;

                retryMessage.textContent = "";

                showPage(3);

                loadQuestion();

            },
            2500
        );

    }

}


// ==========================================
// PAGE 4 → PAGE 5
// ==========================================

function congratulationsContinue() {

    showPage(5);

}


// ==========================================
// PAGE 5 → PAGE 6
// ==========================================

function showFinalSurprise() {

    showPage(6);

    startCelebration();

}


// ==========================================
// FINAL CELEBRATION
// ==========================================

function startCelebration() {

    const container =
        document.getElementById(
            "celebrationContainer"
        );


    const emojis = [
        "❤️",
        "💕",
        "💖",
        "💗",
        "💓",
        "✨",
        "🎉",
        "🥰",
        "😘",
        "🌹",
        "💍"
    ];


    // Create 70 particles

    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "celebration-particle";


        particle.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.fontSize =
            (15 +
            Math.random() * 30) +
            "px";


        particle.style.animationDuration =
            (2 +
            Math.random() * 4) +
            "s";


        particle.style.animationDelay =
            Math.random() * 2 +
            "s";


        container.appendChild(
            particle
        );


        // Remove after animation

        setTimeout(
            function() {

                particle.remove();

            },
            8000
        );

    }

}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "❤️ Anniversary website loaded successfully"
        );


        // Show first page

        showPage(1);

    }
);