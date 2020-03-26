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
		var thisCardNumber = parseInt(thisCard.dataset.card);

		//validate
		if(thisCard.dataset.validate == 'novalidate'){
			navigate('next', thisCard);
			updateProgressBar('next', thisCardNumber);
		}else{
			// При движении вперед сохраняем данные в объект  
			saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

			// isFilled(thisCardNumber);

			//Валидация на заполненность
			if(isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)){
				navigate('next', thisCard);
				updateProgressBar('next', thisCardNumber);
			}else{
				alert('Сделайте ответ, прежде чем переходить далее.');
			}
		}
	})
});

//Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
	button.addEventListener('click', function(){
		var thisCard = this.closest('[data-card]');
		var thisCardNumber = parseInt(thisCard.dataset.card);
		navigate('prev', thisCard);	
		updateProgressBar('prev', thisCardNumber);
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

	//Находим все заполненные значения
	var radioValues = currentCard.querySelectorAll('[type="radio"]');

	radioValues.forEach(function(item){

		if(item.checked){
			result.push({
				name: item.name,
				value: item.value
			});
		}		
	});

	//Находим все заполненные значения из инпутов 
	var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
	inputValues.forEach(function(item){
		inputValues = item.value;
		if(inputValues.trim() !== ''){
			result.push({
				name: item.name,
				value: item.value
			});
		}
	});

	//Находим все заполненные значения из чекбоксов
	var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
	checkBoxValues.forEach(function(item){
		if(item.checked){
			result.push({
				name: item.name,
				value: item.value
			});
		}
	})

	var data = {
		question: question,
		answer: result
	}
	return data;
};

//ф-я записи ответа в объект с ответами 
function saveAnswer(number, data){
	answers[number] = data;
}

//ф-я проверки на заполненость 
function isFilled(number){
	if(answers[number].answer.length > 0){
		return true;
	}else{
		return false; 
	}
}

//Ф-я для провкрки email
function validateEmail(email){
	var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
	return pattern.test(email);
}

//Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number){
	var currentCard = document.querySelector(`[data-card='${number}']`);
	var requiredFields = currentCard.querySelectorAll('[required]');

	var isValidArray = [];

	requiredFields.forEach(function(item){

		if(item.type == 'checkbox' && item.checked == false){
			isValidArray.push(false);
		}else if(item.type == 'email'){
			if(validateEmail(item.value)){
				isValidArray.push(true);
			}else{
				isValidArray.push(false);
			}
		}
	});

	if(isValidArray.indexOf(false) == -1){
		return true;
	}else{
		return false;
	}
}
//Подсвечиваем рамку у радиокнопок 
document.querySelectorAll('.radio-group').forEach(function(item){
	item.addEventListener('click', function(e){

		//Проверяем где прошел клик - внутри тега label или нет 
		var label = e.target.closest('label');
		if(label){
			//Отменяем активный класс у всех label 
			 label.closest('.radio-group').querySelectorAll('label').forEach(function(item){
			 	item.classList.remove('radio-block--active');
			 })
			 //Добавляем активный класс к label по кторому бы клик 
			 label.classList.add('radio-block--active');
		}
	})
})

//Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
	item.addEventListener('change', function(){
		if(item.checked){
			//Добавляем активный класс к тегу label в котором он лежит 
			item.closest('label').classList.add('checkbox-block--active');
			// item.checked.classList.add('checkbox-block--active');
		}else{
			item.closest('label').classList.remove('checkbox-block--active');
		}
	})
})


//Отображаем прогресс бара
function updateProgressBar(direction, cardNumber){

	//Расчитываем колличество всех карточек 
	var cardsTotalNumber = document.querySelectorAll('[data-card]').length;

	//Проверка направления перемещения
	if(direction == 'next'){
		cardNumber += 1;
	}else if(direction == 'prev'){
		cardNumber -= 1;
	}

	//Расчет % прохождения
	 var progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();//toFixed() отсикает числа после точки

	 //Обновляем прогресс бар
	 var currentCard = document.querySelector(`[data-card="${cardNumber}"]`);

	 var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress');
	 if(progressBar){
	 	//Обновляем число прогресс бара
	 	progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
	 	//Обновляем полоску прогресс бара
	 	progressBar.querySelector('.progress__line-bar').style = `width:${progress}%`;
	 }
}
