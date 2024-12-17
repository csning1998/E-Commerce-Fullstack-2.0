function request() {
  return new Promise(function (resolve, reject) {
    var startTime = new Date().getTime();
    setTimeout(() => {
      console.log(new Date());
      console.log("got sometime");

      var now = new Date().getTime();
      if (now - startTime > 50) {
        return reject(new Error("Timeout"));
      }

      resolve();
    }, 100 * Math.random());
  });
}

(async () => {
  console.log("1", new Date());

  // DARK AGE

  // var cb1 = false;
  // var cb2 = false;
  // var cb3 = false;

  // request(function () {
  //   console.log("2", new Date());
  //   cb1 = true;
  //   request(function () {
  //     console.log("4", new Date());
  //     cb2 = true;
  //     request(function () {
  //       console.log("5", new Date());
  //       cb3 = true;
  //     });
  //   });
  // });

  // var interval = setInterval(function () {
  //   if (cb1 && cb2 && cb3) {
  //     console.log("make sure all requests are finished");
  //     interval = clearInterval(interval);
  //   }
  // }, 10);

  // MIDDLE AGE Renaissance
  // request()
  // .then(function(){
  //   console.log("2", new Date());
  //   return request()
  // })
  // .then(function(){
  //   console.log("3", new Date());
  //   return request()
  // })
  // .then(function(){
  //   console.log("4", new Date());
  //   return request()
  // })

  // Modern world

  try {
    await request();
    console.log("2", new Date());

    await request();
    console.log("3", new Date());

    await request();
    console.log("4", new Date());
  } catch (error) {
    console.error(error);

    // console.log()  => /dev/stdout
    // console.error() => /dev/stderr
  }

  console.log("make sure all requests are finished");
})();
