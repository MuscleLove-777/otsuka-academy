// Quiz Engine
function Quiz(questions, levelNum, onComplete) {
    this.questions = questions;
    this.levelNum = levelNum;
    this.onComplete = onComplete;
    this.current = 0;
    this.score = 0;
    this.answered = false;
}

Quiz.prototype.render = function (container) {
    var self = this;
    var q = this.questions[this.current];
    var total = this.questions.length;
    var progress = ((this.current) / total) * 100;

    container.innerHTML = `
        <button class="back-btn" id="quizBackBtn">&larr; 学習に戻る</button>
        <div class="quiz-container">
            <div class="quiz-progress">
                <span>${this.current + 1} / ${total}</span>
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-choices">
                ${q.choices.map(function (c, i) {
                    return `<button class="quiz-choice" data-index="${i}">${c}</button>`;
                }).join('')}
            </div>
            <div class="quiz-explanation" id="explanation">${q.explanation || ''}</div>
            <button class="quiz-next-btn" id="nextBtn" style="display:none;">
                ${this.current < total - 1 ? '次の問題へ' : '結果を見る'}
            </button>
        </div>
    `;

    document.getElementById('quizBackBtn').addEventListener('click', function () {
        // Re-render module
        var event = new CustomEvent('backToModule', { detail: { level: self.levelNum } });
        document.dispatchEvent(event);
    });

    var choices = container.querySelectorAll('.quiz-choice');
    choices.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (self.answered) return;
            self.answered = true;
            var selected = parseInt(this.getAttribute('data-index'));
            var correct = q.answer;

            choices.forEach(function (b) {
                b.disabled = true;
                var idx = parseInt(b.getAttribute('data-index'));
                if (idx === correct) b.classList.add('correct');
                if (idx === selected && idx !== correct) b.classList.add('incorrect');
            });

            if (selected === correct) self.score++;

            var expl = document.getElementById('explanation');
            if (expl && q.explanation) expl.classList.add('show');
            document.getElementById('nextBtn').style.display = 'block';
        });
    });

    document.getElementById('nextBtn').addEventListener('click', function () {
        self.current++;
        self.answered = false;
        if (self.current < self.questions.length) {
            self.render(container);
        } else {
            self.onComplete(self.score, self.questions.length);
        }
    });
};
