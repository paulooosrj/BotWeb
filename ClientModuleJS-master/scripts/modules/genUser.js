module.exports.GenUser = function(nome, key){
	console.log({nome: nome,id: key});
	return "Nome : "+nome+", ID: "+key;
}