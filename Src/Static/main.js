let $ = (x)=>document.querySelector(x);

function ajax(method,url,query){
   return new Promise((resolve,reject)=>{
      let xhttp = new XMLHttpRequest();
      xhttp.open(method,url);
      if(method.toLowerCase()=='post')
         xhttp.setRequestHeader('Content-Type','application/x-www-form-urlencode');
      xhttp.send(query);

      xhttp.onreadystatechange(function(){
         if(this.readyState == 4) {
            if(!this.status!=200) reject({status: this.status, res: this.responseText});
            else resolve({res: this.responseText});
         }
      });

   });
}