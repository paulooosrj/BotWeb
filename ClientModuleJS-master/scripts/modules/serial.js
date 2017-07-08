function Generate(max){
	return Math.floor(Math.random() * max);
}

function Log(text){
	console.log(text);
}

module.exports = {
	Generate: Generate,
	Log: Log
};