document.body.insertAdjacentHTML("beforeEnd", `<center id="windowLoad">Loading...</center>`);

ajax("get", "/api/userInfo")
   .then((resp) => {
      let res = JSON.parse(resp.res);
      let typeToHide = res.type == "faculty" ? "student" : "faculty";
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
      } else if (res.type == 1) {
         summary["No of Leaves Processed this month "] = res.numLeavesProcessed;
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
      console.log(res);
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
