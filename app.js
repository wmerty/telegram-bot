var TelegramBot = require('node-telegram-bot-api');
var fibonacci = require('fibonacci-fast');
var isPrime = require('prime-number');

// replace the value below with the Telegram token you receive from @BotFather
var token = '328743813:AAFo7kTssv2l9TJeEYsqGTOhAkzOiwcSuNc';

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, { polling: true });



bot.onText(/\/help/, function(msg, match) {

	var str1 = "Список рассчитываемых бонусов:\n\n"
	var str2 = "1. Бонус за сумму чисел \n"
	var str3 = "2. Бонус за простое число (первая цифра номера +1)\n"
	var str4 = "3. Бонус за число Фибоначчи = 4 балла)\n"
	var str5 = "4. Бонус ЕН = 6 баллов\n"
	var str6 = "5. Бонус за двойные буквы = 2 балла, за тройные = 4 балла\n\n"

	var str7 = "Вводить в бота сразу текст: русские, английские буквы, большие, маленькие, только буквы, только цифры, целиком номер.\n"
	var str8 = "Учитываются только первые 3 буквы из номера и первые 3 цифры."


	bot.sendMessage(msg.from.id, "" + str1+str2+str3+str4+str5+str6+str7+str8)
})


  bot.onText(/(.+)/, function(msg) {

  if (msg.text.substring(0,1) == '/'){
		return
	}

	var numberPattern = /\d+/gi
	var letterPattern = /[А-ЯA-Z]/gi
	var enPattern = /en|ен/gi
	var reqnum = msg.text

	var bonus = 0
	var primeBonus = 0
	var fibBonus = 0
	var sumDigits = 0
	var doubleLetters = 0
	var enBonus = 0

	if (reqnum.match(numberPattern) != null)
	{
		var digits = reqnum.match(numberPattern).join([])
		digits = digits.substring(0,3)
		var firstDigit = digits.substring(0,1)
	}

	if (reqnum.match(letterPattern) != null)
	{
		var letters = reqnum.match(letterPattern).join([])

		letters = letters.substring(0,3)

		var patt = /([а-яa-z])\1+/gi
		var lettersMatch = letters.match(patt)

		if (lettersMatch) {
			var result = lettersMatch.join([])

			if (!!result){
				if (result.length > 2) {
				bonus += 4
				doubleLetters = 4
				} else if (result.length > 1){
					bonus += 2
					doubleLetters = 2
				}
			}
		}

		if (enPattern.test(letters)){
			bonus += 6
			enBonus = 6
		}
	}

	if (!!parseInt(digits)){
		if (fibonacci.is(parseInt(digits))){
			bonus += 4//(parseInt(firstDigit)+1)
			fibBonus = 4//(parseInt(firstDigit)+1)
		}
		if (digits.replace(/^0+/,'') != 1){
			if (isPrime(parseInt(digits))) {
				bonus += (parseInt(firstDigit)+1)
				primeBonus = (parseInt(firstDigit)+1)
			}
	  }

		var sum = digits
		while (sum.length > 1) {
			sum = sum.split("").reduce(function(a,b) { return parseInt(a) + parseInt(b) }).toString()
		}
    sumDigits = parseInt(sum)

		bonus += parseInt(sum)

	}

	// if(!!letters){
	// 	var enBonus = 1
	// }

	var description = "Сумма чисел: " + sumDigits + "\nФибоначчи: " + fibBonus + "\nПростое: " + primeBonus + "\nДвойные|Тройные буквы: " + doubleLetters + "\nЕН: " + enBonus

	bot.sendMessage(msg.from.id, "" + "Бонус всего: " + bonus + "\n\n" + description)
})
