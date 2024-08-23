let getBalanceInterval;
let getNetworkTestInterval;
let lastUpdatedTime;
let isInternet=false;
document.addEventListener('DOMContentLoaded', () => {

  const networkquality = document.getElementById("netwokquality_");
  const lastupdatedatetime = document.getElementById("lastupdatedatetime");
  if (navigator.onLine) {
    console.log("Internet is connected");
    // Perform actions for when internet is connected
    document.getElementById("isnetworkconnected").textContent="Connected";
    const icon = document.getElementById('i_connect');
      icon.style.color = 'green';
      icon.style.fontSize = 'small';
      isInternet=true;
  } else {
    console.log("Internet is not connected");
    // Perform actions for when internet is not connected
    document.getElementById("isnetworkconnected").textContent="Disconnected";
    const icon = document.getElementById('i_connect');
    const text= document.getElementById("isnetworkconnected");
    icon.style.color = 'gray';
    icon.style.fontSize = 'small';
    isInternet=false;
    text.style.color="gray";

  }
  const startTime = new Date().getTime();
  fetch('https://8.8.8.8', { mode: 'no-cors' })
    .then(() => {
      const endTime = new Date().getTime();
      const latency = endTime - startTime;
      console.log(`Latency: ${latency}ms`);
      isInternet=true;
      if (latency < 50) {
        console.log("Excellent connection");
        //100
        networkquality.textContent="100";

      } else if (latency < 100) {
        console.log("Good connection");
        //90
        networkquality.textContent="90";
      } else if (latency < 200) {
        console.log("Fair connection");
        //75
        networkquality.textContent="75";
      } else {
        console.log("Poor connection");
        //40
        networkquality.textContent="40";
      }
    })
    .catch(error => {
      console.error('Ping test failed:', error);
      document.getElementById("isnetworkconnected").textContent="Disconnected";
      const icon = document.getElementById('i_connect');
      const text= document.getElementById("isnetworkconnected");
      text.style.color="gray";
      icon.style.color = 'gray';
      icon.style.fontSize = 'small';
      isInternet=false;
      document.getElementById('connectedMsg').style.display = 'none';

    });


    const dawnbalance = document.getElementById('dawnbalance');

    chrome.storage.local.get("token", async (result) => {

      if(result==undefined||result==null ||result.token==undefined || result.token=="")
          {
              alert("Login first!!");
              window.location.href = 'signin.html';
          }
          else
          {
            //let expiredToken = "2056b72d0eb33beb2a6d2d39c67296afa677fc1f271efaf0d84b5d50cd08aee410c07f2f8a6510b58ab067551517964a9b712a207a15ea4f311b2b0364b0fd4be4b73a16b0be5708eaea1eeecc896238091f290f0f7a173e8a665a8cda3fe8625e6669adee14f08415335e123bac05218478fd5bfaf8810145bd97daf7c53b5039db2dd60cfd0de17ab9bd349623887c02a7789691d1c1fd02de15b2d9061b55c82233432f43b08ee746286fcc9515a18adfc9193e433d8c56c867a3e8a54ade18f11660f597e5fa46099ca5f2cc5f59356039379db30f6dc8af5c355ab82406c41fba212b6b3cc3eb36759c84491347";

                //alert(result.username);
              try {
                const response = await fetch(
                  "https://www.aeropres.in/api/atom/v1/userreferral/getpoint",
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Berear " + result.token,
                    },
                  }
                );
                
                const data = await response.json();
                if (response.ok) {
                    // chrome.storage.local.set({ "dawnbalance":data.data.balance}, () => {
                        
                    //     dawnbalance.textContent = (data.data.balance)/10**18;
                    //   });
                    let points = Number(data.data?.rewardPoint?.points);
                    let registerpoints = Number(data.data?.rewardPoint?.registerpoints);
                    let signinpoints = Number(data.data?.rewardPoint?.signinpoints);
                    let commission = Number(data.data?.referralPoint==null?0:data.data?.referralPoint.commission);
                    let twitter_x_id_points = Number(data.data?.rewardPoint?.twitter_x_id_points);
                    if(twitter_x_id_points>0)
                      {
                        chrome.storage.local.set({ "twitter_x_id_points":twitter_x_id_points}, () => {});

                      }
                      let discordid_points = Number(data.data?.rewardPoint?.discordid_points);
                      if(discordid_points>0)
                        {
                          chrome.storage.local.set({ "discordid_points":discordid_points}, () => {});

                        }
                        let telegramid_points = Number(data.data?.rewardPoint?.telegramid_points);
                        if(telegramid_points>0)
                          {
                            chrome.storage.local.set({ "telegramid_points":telegramid_points}, () => {});

                          }

                    dawnbalance.textContent = (points+registerpoints+signinpoints +commission +twitter_x_id_points+discordid_points+telegramid_points).toLocaleString("en", { useGrouping: true }) + " " + 
                    'pts';
                    
                    let time1 = data.data?.referralPoint?.updatedAt;
                    let time2 = data.data?.rewardPoint?.updatedAt;
                    if(new Date(time1)>new Date(time2))
                      {
                        lastUpdatedTime=time1;
                      }else
                      {
                        lastUpdatedTime=time2;
                      }
                      lastupdatedatetime.textContent=formatDate(lastUpdatedTime);
             
                } else {
                  throw new Error(data.message || 'An error occurred');
                }
              } catch (error) {
                if(error.message!=undefined && !error.message.includes("fetch")){

                if(isInternet){
                  
                alert(error.message);

              let m = error.message;
              let word="TokenExpiredError";
              let word2="session";
              if (m.includes(word) || m.includes(word2)) {
                window.location.href = 'signin.html';
              } 
              
              }
            
                else
                {
                  alert("Not Internet connection!!")
                  document.getElementById('connectedMsg').style.display = 'none';
                }}else
                {
                  
                }
              }

             
              
          }
             
  });


 
     getBalanceInterval = setInterval(() => getLatestBalance(), 120000);
    function getLatestBalance()
    {
      if(isInternet){
      chrome.storage.local.get("token", async (result) => {

        if(result==undefined||result==null ||result.token==undefined || result.token=="")
            {
                alert("Login first!!");
                window.location.href = 'signin.html';
            }
            else
            {
              
                  //alert(result.username);
                try {
                  const response = await fetchWithRetry(
                    "https://www.aeropres.in/api/atom/v1/userreferral/getpoint",
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Berear " + result.token,
                      },
                    }
                  );
            
                  const data = await response.json();
                  if (response.ok) {
                    console.log("dashboard updating...")
                      // chrome.storage.local.set({ "dawnbalance":data.data.balance}, () => {
                          
                      //     dawnbalance.textContent = (data.data.balance)/10**18;
                      //   });
                      let points = Number(data.data?.rewardPoint?.points);
                      let registerpoints = Number(data.data?.rewardPoint?.registerpoints);
                      let signinpoints = Number(data.data?.rewardPoint?.signinpoints);
                      let commission = Number(data.data?.referralPoint==null?0:data.data?.referralPoint.commission);

                      let twitter_x_id_points = Number(data.data?.rewardPoint?.twitter_x_id_points);
                    if(twitter_x_id_points>0)
                      {
                        chrome.storage.local.set({ "twitter_x_id_points":twitter_x_id_points}, () => {});

                      }
                      let discordid_points = Number(data.data?.rewardPoint?.discordid_points);
                      if(discordid_points>0)
                        {
                          chrome.storage.local.set({ "discordid_points":discordid_points}, () => {});

                        }
                        let telegramid_points = Number(data.data?.rewardPoint?.telegramid_points);
                        if(telegramid_points>0)
                          {
                            chrome.storage.local.set({ "telegramid_points":telegramid_points}, () => {});

                          }

                    dawnbalance.textContent = (points+registerpoints+signinpoints +commission +twitter_x_id_points+discordid_points+telegramid_points).toLocaleString("en", { useGrouping: true })+ " " + 
                    'pts';
                    

                      let time1 = data.data?.referralPoint?.updatedAt;
                    let time2 = data.data?.rewardPoint?.updatedAt;
                    if(new Date(time1)>new Date(time2))
                      {
                        lastUpdatedTime=time1;
                      }else
                      {
                        lastUpdatedTime=time2;
                      }
                      lastupdatedatetime.textContent=formatDate(lastUpdatedTime);
                      console.log("dashboard updated.")

               
                  } else {
                    throw new Error(data.message || 'An error occurred');
                  }
                } catch (error) {
                  
                  if(error.message!=undefined && !error.message.includes("fetch")){
                  alert(error.message);
                  let m = error.message;
              let word="TokenExpiredError";
              let word2="session";
              if (m.includes(word) || m.includes(word2)) {
                window.location.href = 'signin.html';
              } 
            }

                }

               
                
            }
               
    });
  }
    }
    document.getElementById("refreshpoint").addEventListener("click",async function(){
      getLatestBalance();
    });
    getNetworkTestInterval = setInterval(() => networkTest(), 1000 * 60 *15);
    function networkTest()
    {
      const startTime = new Date().getTime();
      fetch('https://8.8.8.8', { mode: 'no-cors' })
    .then(() => {
      const endTime = new Date().getTime();
      const latency = endTime - startTime;
      console.log(`Latency: ${latency}ms`);
      isInternet=true;
      if (latency < 50) {
        console.log("Excellent connection");
        //100
        networkquality.textContent="100";

      } else if (latency < 100) {
        console.log("Good connection");
        //90
        networkquality.textContent="90";
      } else if (latency < 200) {
        console.log("Fair connection");
        //75
        networkquality.textContent="75";
      } else {
        console.log("Poor connection");
        //40
        networkquality.textContent="40";
      }
    })
    .catch(error => {
      console.error('Ping test failed:', error);
      document.getElementById("isnetworkconnected").textContent="Disconnected";
      const icon = document.getElementById('i_connect');
      icon.style.color = 'gray';
      icon.style.fontSize = 'small';
      isInternet=false;
      document.getElementById('connectedMsg').style.display = 'none';

    });
    }
    // Attach the clear function to the beforeunload event
  
  

  });
  window.addEventListener('beforeunload', clearMyInterval);
  function clearMyInterval() {
    clearInterval(getBalanceInterval);
    clearInterval(getNetworkTestInterval);
    console.log("Interval cleared");
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Adjust hours
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return `${month} ${day}${ordinalSuffix(day)}, ${year} ${formattedHours}:${formattedMinutes} ${ampm} GMT`;

  }

  async function fetchWithRetry(url, options = {}) {
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds
  
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, options);
        return response; // If successful, return the response
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          // This error typically indicates a network error (server down)
          if (attempt === MAX_RETRIES) {
            throw error; // If all retries failed, throw the last error
          }
          console.log(`Server seems to be down. Attempt ${attempt} failed. Retrying in ${RETRY_DELAY / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          // For other types of errors, throw immediately without retrying
          throw error;
        }
      }
    }
  }
  