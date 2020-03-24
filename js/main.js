//Сохранение ответов
var answers = {
	2: null,
	3: null,
	4: null,
	5: null
}

//Движение вперед
var btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
	button.addEventListener('click', function(){
		var thisCard = this.closest('[data-card]');

		//validate
		if(thisCard.dataset.validate == 'novalidate'){
			console.log('novalidate');
			navigate('next', thisCard);
		}else{
			console.log('validate');
			navigate('next', thisCard);
		}
	})
});

//Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
	button.addEventListener('click', function(){
		var thisCard = this.closest('[data-card]');
		navigate('prev', thisCard);	
	})
});

//ф-я для навигации вперед назад 
function navigate(direction, thisCard){
	var thisCardNumber = parseInt(thisCard.dataset.card);
	var nextCard, prevCard;

	if(direction == 'next'){
	nextCard = thisCardNumber + 1;
	}else if(direction == 'prev'){
	nextCard = thisCardNumber - 1;
	}
	thisCard.classList.add('hidden');
	document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden');
}

//ф-я сбора данных с карточек 
function gatherCardData(number){

	var question;
	var result = [];

//Находим карточку по номеру и data-атрибуту
	var currentCard = document.querySelector(`[data-card="${number}"]`);

	//Находим главный вопрос карточки 
	question =  currentCard.querySelector('[data-question]').innerText;
	console.log(question);


	//Находим все заполненные значения
	var radioValues = currentCard.querySelectorAll('[type="radio"]');

	radioValues.forEach(function(item){

		if(item.checked){
			result.push({
				name: item.name,
				value: item.value,
			})
		}		
	})

	var data = {
		question: question,
		answer: result
	}

	return data;

};