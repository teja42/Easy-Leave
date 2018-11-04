document.body.insertAdjacentHTML("beforeEnd", `<center id="windowLoad">Loading...</center>`);

ajax("get", "/api/userInfo")
   .then((resp) => {
      let res = JSON.parse(resp.res);
      console.log(res);
      let typeToHide = res.type == 1 ? "student" : "faculty";
      document.styleSheets[0].insertRule(`[x-for-${typeToHide}]{ display: none;}`, 0);
      $("#windowLoad").innerHTML = "Done.";
      $("#windowLoad").style.animation = "fadeOut linear 2s";
      setTimeout(() => {
         $("#windowLoad").style.display = "none";
      }, 2000);
      let summary = {
         Name: res.name,
         "Account Type": res.type == 1 ? "Faculty" : "Student"
      };
      if (res.type == 2) {
         summary["Leaves Approved this month "] = res.numLeaves;
      }
      for (obj in summary) {
         $("#summary").insertAdjacentHTML("beforeEnd", `<strong>${obj} : </strong><span>${summary[obj]}</span><br>`);
      }
      window.location.hash = "#summary";
   })
   .catch((err) => {
      $("#windowLoad").innerHTML = `An Error Occured! HTTP ${err.status} <br> <button class="button-sd" onclick="window.location=window.location;">Reload</button>`
   });

let clearInfo = () => {
   $("#info").innerHTML = null;
}

let addInfo = (info) => {
   $("#info").innerHTML = info;
}

function applyForLeave() {
   clearInfo();
   let subject = $("#applyForLeaveForm>input[name='subject']").value;
   let desc = $("#applyForLeaveForm>textarea[name='desc']").value;
   let fromDate = $("#applyForLeaveForm>input[name='fromDate']").value;
   let toDate = $("#applyForLeaveForm>input[name='toDate']").value;

   if (!subject || !desc || !fromDate || !toDate) {
      return addInfo("All fields are required");
   }

   let btn = buttonClickAnim($("#applyLeaveBtn"));

   ajax('post', '/api/s/applyForLeave', `subject=${subject}&desc=${desc}&fromDate=${fromDate}&toDate=${toDate}`)
      .then((res) => {
         addInfo("Request sucessfully sent");
      })
      .catch((err) => {
         addInfo(`${err.res}` || `HTTP ${err.status}`);
      })
      .finally(btn.end);

}

function getLeaveHistory() {
   clearInfo();
   let numResults = $("#leaveHistoryForm>input[name='numResults']").value;
   if (!numResults) {
      return addInfo("You need to specify the number of results.");
   }

   let btn = buttonClickAnim($("#leaveHistoryBtn"));

   ajax('post', `/api/s/leaveHistory`, `numResults=${numResults}`)
      .then((resp) => {
         let res = JSON.parse(resp.res);
         let tbody = $("#leaveHistoryTableBody");
         let statusCodeToString = (status) => {
            switch (status) {
               case 1: return "Approved";
               case 0: return "Pending";
               case -1: return "Rejected";
            }
         }
         tbody.innerHTML = null;
         tbody.insertAdjacentHTML('beforeEnd',
            `
         <tr style="background-color: whitesmoke">
            <td>#</td>
            <td>Date Applied</td>
            <td>Subject</td>
            <td>From - To</td>
            <td>Status</td>
         </tr>
      `);
         for (let i = 0; i < res.length; i++) {
            tbody.insertAdjacentHTML('beforeEnd',
               `
            <tr>
               <td>${i+1}</td>
               <td>${new Date(res[i].ts).toLocaleString()}</td>
               <td>${res[i].subject}</td>
               <td>${res[i].fromDate} - ${res[i].toDate}</td>
               <td>${statusCodeToString(res[i].status)}</td>
            </tr>
            `
            );
         }
      })
      .catch((err) => {
         console.log(err);
         addInfo(err.res || `${err.status}`);
      })
      .finally(btn.end);

}

function pendingApproval(page){
   clearInfo();
   if(!page)
      page = $("#pendingApprovalPagination>input[name='page']").value;
   if(!page || page<1){
      return addInfo("Page Number is not valid.");
   }

   let btn = buttonClickAnim($("#pendingApprovalPaginationBtn"));

   ajax('post','/api/f/pendingApproval',`page=${page}`)
   .then((resp)=>{
      let response = JSON.parse(resp.res);
      let requests = response.docs;
      $("#pendingApprovalTotalPages").innerHTML = response.pages;
      let body = $("#pendingApprovalContent");
      body.innerHTML = null;
      for(let i=0; i<requests.length; i++){
         body.insertAdjacentHTML('beforeEnd',
         `
         <div class='leave' x_id='${requests[i]._id}'>
            <h4>${requests[i].subject}</h4>
            <p>${requests[i].desc}</p>
            <p>${requests[i].name} - ${requests[i].id}</p>
            <strong>Leaves Approved this month : ${requests[i].leavesApproved}</strong>
            <br>
            <button class="button-sd" onclick="javascript:processLeaveRequest(this,'${requests[i]._id}',${true})">Approve</button>
            <button class="button-sd red" onclick="javascript:processLeaveRequest(this,'${requests[i]._id}',${false})">Reject</button>
         </div>
         `
         );
      }
      if(requests.length==0){
         body.insertAdjacentHTML('beforeEnd','<h4 style="margin: 20px;">No Pending Requests</h4>');
      }
   })
   .catch((err)=>{
      console.log(err);
      addInfo(`HTTP ${err.status}\n${err.res}`);
   })
   .finally(btn.end);

}

function processLeaveRequest(btn,_id,approve){
   clearInfo();
   let _btn = buttonClickAnim(btn);
   console.log(_id);
   ajax('post','/api/f/updateLeaveRequest',`approve=${approve}&_id=${_id}`)
   .then((res)=>{
      removeElement($(`[x_id="${_id}"]`));
   })
   .catch((err)=>{
      console.log(err);
      addInfo(`HTTP ${err.status}\n${err.res}`);
   })
   .finally(_btn.end);
}