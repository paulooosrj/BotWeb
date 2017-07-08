function pega(config){
  var ex1 = config.entre[0][0] || "",
      ex2 = config.entre[0][1] || "",
      str = config.string || "",
      rn = "";
  if(str.length > 0){
    if(config.entre.length == 1){
      var e = new RegExp(ex1+"(.*?)"+ex2,"gi");
      rn = e.exec(str)[1];
    } else if(config.entre.length > 1){
       rn = [];
       config.entre.map((v) => {
         var e = new RegExp(v[0]+"(.*?)"+v[1],"gi");
         rn.push(e.exec(str)[1]);
       });
    }
  }
  return rn;
}

pega({
  entre: [["login=",";"],["senha=",";"]],
  string: "ola login=paulao; senha=paulo2017;"
});