let $ = (x)=>document.querySelector(x);

function ajax(method,url,query=''){
   return new Promise((resolve,reject)=>{
      let xhttp = new XMLHttpRequest();
      method = method.toUpperCase();
      xhttp.onreadystatechange = function(){
         if(this.readyState == 4) {
            if(this.status!=200) reject({status: this.status, res: this.responseText});
            else resolve({res: this.responseText,status: this.status});
         }
      };
      xhttp.open(method,url,true);
      if(method=='POST')
         xhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xhttp.send(encodeURI(query));
   });
}

function buttonClickAnim(btn){
   console.log(btn);
   let originalHTML = btn.innerHTML;
   btn.innerHTML = "Loading...";
   btn.setAttribute("disabled","");
   return {
      end: ()=>{
         btn.innerHTML = originalHTML;
         btn.removeAttribute("disabled");
      }
   }
}