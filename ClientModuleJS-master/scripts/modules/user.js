class User{

	constructor(name){
		this.nome = name;
		console.log("Novo usuario : "+ name);
	}

	getNome(){
		return this.nome;
	}

	getId(){
		return Math.floor(Math.random() * 10000);
	}

}

exports.CreateUser = User;