var express = require("express");
var http     = require("http");
var fs = require('fs');
var qs = require('querystring');
var port = process.env.PORT || 3000;
const { MongoClient } = require("mongodb");
const urll = process.env.MONGODB_URLL;
const url2 = "mongodb+srv://annalisejacobson:annalise@cluster0.0y4mi.mongodb.net/tuftsdining?retryWrites=true&w=majority";
const userurl = 'mongodb+srv://unellu01:aaa@cluster0.trnuo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const foodsurl = "mongodb+srv://user1:caleb@cluster0.0y4mi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


var app = express();
app.use(express.static("public"));
var file;
app.get('/', function (req, res, next) {
  file = 'index.html';
  fs.readFile(file, function(err, txt) {
      if(err) { return console.log(err); }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      setTimeout(function(){res.end();}, 2000);
    });
});
app.get('/index.html', function (req, res, next) {
  file = 'index.html';
  fs.readFile(file, function(err, txt) {
      if(err) { return console.log(err); }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      setTimeout(function(){res.end();}, 2000);
    });
});
app.get('/index.html/process', function (req, res, next) {
	console.log("Process the form");
	pdata = "";
	req.on('data', data => {
           pdata += data.toString();
    });
  req.on('end', () => {
	pdata = qs.parse(pdata);
	var Email = pdata["email"];
	
		MongoClient.connect(urll, { useUnifiedTopology: true }, function(err, db) {
		console.log("hello");
		  if(err) { return console.log("mongo err: " + err); }

			var dbo = db.db("users");
			var collection = dbo.collection('profiles');
			var theQuery = {email: Email} 
				collection.find(theQuery).toArray(function(err, items) {
					  if (err) {
						console.log("Error: '" + err+"'}");
					  } 
					  else if(items.length == 0){
						  var newData = {"fullname": name, "email": Email,"foods":[]};
						  collection.insertOne(newData, function(err, res){
							  if(err) { 
								  console.log("query err: " + err); 
								  return; 
							}
						  console.log("new document inserted");
					});
				} 

		});
			
			setTimeout(function(){db.close;}, 2000);
		}); 
});
res.redirect('/home.html');
return;
});
app.get('/home.html', function (req, res) {
  file = 'home.html';
  fs.readFile(file, function(err, txt) {
      if(err) { return console.log(err); }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      setTimeout(function(){res.end();}, 2000);
    });
});

app.get('/menu.html/breakfast',function(req,res) {
	
	
	file = 'my_choice.html';
	fs.readFile(file, function(err, txt) {
	      if(err) { return console.log(err); }
	      res.writeHead(200, {'Content-Type': 'text/html'});
		
		//res.write("whole URL: " + req.url);
		//res.write(" SHOUld get actual thing: ")
		var stringURL = req.url.toString()
		//res.write(stringURL );
	
		stringURL = stringURL.split("=");
		stringURL = stringURL[1];
		res.write("User email: " + stringURL );

	      res.write(txt);	  
	  
		  MongoClient.connect(url2,{useUnifiedTopology:true},function(err, db) {
			if (err) {
				return console.log("err");
			}
			var dbo = db.db("tuftsdining");
			var coll = dbo.collection("menu3");

			  res.write("<form method='post' action='https://jumbo-bell.herokuapp.com/menu.html/process' >");
			  
			  res.write("<br>");
			  res.write("<br>");
			  
			  var emailform = "<input type = 'text' id = 'email' value = " + stringURL + "name = 'foodname'/> "

			  res.write(emailform);

			  var bfastarr = [];
			  coll.find({meal:"breakfast"}).toArray(function(err,items) {
				  if(err) {
					  console.log("Error: " + err);
				  } else {
					  var bfast = "";
					  bfast += ("<div class='foodlist' style='width:30%;'>");
					  bfast += ("<h1>Breakfast</h1>");
					  bfast += ("<br><input type='submit' value='Add Selected Foods to Favorites'/><br><hr><br>");
					  for (i=0; i<items.length; i++) {
						  //check if repeated value
						  var repeatedvalue = false;
						  for (j=0;j<bfastarr.length;j++) {
							  if (items[i].food == bfastarr[j]) {
								  repeatedvalue = true;
								  break;
							  }
						  }
						  if (!repeatedvalue) {
							  bfast += ("<input type='checkbox'  onchange='getFormData()' name='bfast' value = '" + items[i].food + "' >" + items[i].food +  " </input>" + "<br>");
						  }
						  bfastarr.push(items[i].food);

					  }
					  bfast += ("</div>");
					  res.write(bfast);
					  res.write("<input type = 'hidden' id = 'hidden' name = 'hidden' >");
					  res.write("</form>");

					  res.write("<script>");
					  res.write("function getFormData(){");
					  res.write("var check ='';");
					  res.write(" var items = document.getElementsByName('bfast');");
					  res.write("for (var i = 0; i < items.length; i++) {");
					  res.write("if (items[i].checked == true) {");
					  res.write("check = check + items[i].value + ',';}}");
					  res.write("document.getElementById('hidden').value = check;");
					  res.write("};");
					  res.write("</script>");
					  setTimeout(function(){res.end();}, 2000);
				  }
			  });
			  setTimeout(function(){db.close;}, 2000);
			  
		  });
		
	});
	
});
app.get('/menu.html/lunch',function (req,res) {
	file = 'my_choice.html';
	fs.readFile(file, function(err, txt) {
	      if(err) { return console.log(err); }
	      res.writeHead(200, {'Content-Type': 'text/html'});
	      res.write(txt);	  
	  
		  MongoClient.connect(url2,{useUnifiedTopology:true},function(err, db) {
			if (err) {
				return console.log("err");
			}
			var dbo = db.db("tuftsdining");
			var coll = dbo.collection("menu3");

			  res.write("<form method='post' action='https://jumbo-bell.herokuapp.com/menu.html/process' onsubmit = 'getFormData()'>");
			  var luncharr = [];
			  coll.find({meal:"Lunch"}).toArray(function(err,items) {
				  if(err) {
					  console.log("Error: " + err);
				  } else {
					  var lunch = "";
					  lunch += ("<div class='foodlist' style='width:30%;'>");
					  lunch += ("<h1>Lunch</h1>");
					  lunch += ("<br><input type='submit' value='Add Selected Foods to Favorites'/><br><hr><br>");
					  for (i=0; i<items.length; i++) {
						  //check if repeated value
						  var repeatedvalue = false;
						  for (j=0;j<luncharr.length;j++) {
							  if (items[i].food == luncharr[j]) {
								  repeatedvalue = true;
								  break;
							  }
						  }
						  if (!repeatedvalue) {
							  lunch += ("<input type='checkbox'  onchange='getFormData()' name='lunch' value = '" + items[i].food + "' >" + items[i].food +  " </input>" + "<br>");
						  }
						  luncharr.push(items[i].food);

					  }
					  lunch += ("</div>");
					  res.write(lunch);
					  res.write("<input type = 'hidden' id = 'hidden2' name = 'hidden' >");
					  res.write("</form>");

					  res.write("<script>");
					  res.write("function getFormData(){");
					  res.write("var check ='';");
					  res.write(" var items = document.getElementsByName('lunch');");
					  res.write("for (var i = 0; i < items.length; i++) {");
					  res.write("if (items[i].checked == true) {");
					  res.write("check += items[i].value;}}");
					  res.write("document.getElementById('hidden2').value = check;");
					  res.write("};");
					  res.write("</script>");
					  setTimeout(function(){res.end();}, 2000);
				  }
			  });
			  setTimeout(function(){db.close;}, 2000);
		  });
		
	});
});
app.get('/menu.html/dinner',function (req,res) {
	file = 'my_choice.html';
	fs.readFile(file, function(err, txt) {
	      if(err) { return console.log(err); }
	      res.writeHead(200, {'Content-Type': 'text/html'});
	      res.write(txt);	  
	  
		  MongoClient.connect(url2,{useUnifiedTopology:true},function(err, db) {
			if (err) {
				return console.log("err");
			}
			var dbo = db.db("tuftsdining");
			var coll = dbo.collection("menu3");

			  res.write("<form method='post' action='https://jumbo-bell.herokuapp.com/menu.html/process' onsubmit = 'getFormData()'>");
			  var dinnerarr = [];
			  coll.find({meal:"Dinner"}).toArray(function(err,items) {
				  if(err) {
					  console.log("Error: " + err);
				  } else {
					  var dinner = "";
					  dinner += ("<div class='foodlist' style='width:30%;'>");
					  dinner += ("<h1>Dinner</h1>");
					  dinner += ("<br><input type='submit' value='Add Selected Foods to Favorites'/><br><hr><br>");
					  for (i=0; i<items.length; i++) {
						  //check if repeated value
						  var repeatedvalue = false;
						  for (j=0;j<dinnerarr.length;j++) {
							  if (items[i].food == dinnerarr[j]) {
								  repeatedvalue = true;
								  break;
							  }
						  }
						  if (!repeatedvalue) {
							  dinner += ("<input type='checkbox'  onchange='getFormData()' name='dinner' value = '" + items[i].food + "' >" + items[i].food +  " </input>" + "<br>");
						  }
						  dinnerarr.push(items[i].food);

					  }
					  dinner += ("</div>");
					  res.write(dinner);
					  res.write("<input type = 'hidden' id = 'hidden3' name = 'hidden' >");
					  res.write("</form>");
					  res.write("<script>");
					  res.write("function getFormData(){");
					  res.write("var check ='';");
					  res.write(" var items = document.getElementsByName('dinner');");
					  res.write("for (var i = 0; i < items.length; i++) {");
					  res.write("if (items[i].checked == true) {");
					  res.write("check += items[i].value;}}");
					  res.write("document.getElementById('hidden3').value = check;");
					  res.write("};");
					  res.write("</script>");
					  setTimeout(function(){res.end();}, 2000);
				  }
			  });
			  setTimeout(function(){db.close;}, 2000);
		  });
		
	});
});
app.post('/menu.html/process', function (req, res) {
	file='processchoices.html';
	fs.readFile(file,function(err,txt) {
		if(err) {return console.log(err);}
		res.writeHead(200, {'Content-Type':'text/html'});
		res.write(txt);
		setTimeout(function(){res.end();}, 2000);
		console.log("Process the form");
		pdata = "";
		req.on('data', data => {
			pdata += data.toString();
		});
	});
  
	req.on('end', () => {
	pdata = qs.parse(pdata);
	var mail;
	var x = String(pdata['hidden']);
	reader = fs.createReadStream('index.html');
	var qdata = "";
	reader.on('data', function (chunk) {
	    qdata += String(chunk);
	});
	mail = String(qdata["email"]);
	res.write(mail);
	//calebs code to add foods the user chooses to their database 
	//x is the string representing all the foods the user chose
	 uploaduserfood(x, mail);
		
		
	 function uploaduserfood(foodstring, useremail) { 
            
        foodstring = foodstring.split(",")  
        MongoClient.connect(userurl,{useUnifiedTopology:true},function(err, db ) {
                        
            
            
            if (err) {
                console.log("Connection err: " + err);
            }
            var dbo = db.db("users");
            var coll = dbo.collection('profiles');
                            
            console.log(foodstring);                        
            var myquery = { email: useremail };
            var newvalues = {  $addToSet: { foods: { $each: foodstring } } };
                
            coll.updateOne(myquery, newvalues, function(err, res) {
                 if (err) throw err;
                 console.log("user: " + useremail + " updated");
                 });
                
                
        //    }
            
            
            

        
            
            setTimeout(function(){ db.close(); console.log("Success!");}, 1000);
        })

        
    }

		
		
	//end calebs code to add foods the user chooses to their database
	setTimeout(function(){res.end();}, 2000);

	});  
	
});
app.get('/about.html', function (req, res) {
  file = 'about.html';
  fs.readFile(file, function(err, txt) {
      if(err) { return console.log(err); }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      setTimeout(function(){res.end();}, 2000);
    });
});
app.get('/menu.html', function (req, res) {
 file = 'menu.html';
 fs.readFile(file, function(err, txt) {
     if(err) { return console.log(err); }
     res.writeHead(200, {'Content-Type': 'text/html'});
     res.write(txt);
     setTimeout(function(){res.end();}, 2000);
   });
});

app.get('/account.html',function(req,res) {
	file = 'account.html';
	fs.readFile(file, function(err, txt) {
     	if(err) { return console.log(err); }
     	res.writeHead(200, {'Content-Type': 'text/html'});
     	res.write(txt);
	res.write("<br> My Favorites: ");
		//display user database favorite foods data
     	setTimeout(function(){res.end();}, 2000);
   });
});

// code to get all of current users favorite foods being served 
app.get('/my_choice.html/finduserfoods', function (req, res) {
	res.writeHead(200, {'Content-Type':'text/html'});
	
	var stringURL = req.url.toString();
	res.write(stringURL );
	stringURL = stringURL.split("=");
	
	//stringURL = stringURL.split('; email=');

         stringURL = stringURL[1];
	
	stringURL  = (decodeURIComponent(stringURL));

	res.write("user email: " + stringURL );
	
	//res.write("<br>");

	//code to email and display stuff 
	
	  getusersfoods(stringURL);
  //console.log("returned user food arr" + userfoodarr);



 function getusersfoods(useremail) {
    
        
    MongoClient.connect(userurl,{useUnifiedTopology:true},function(err, db ) {
        
        
        if (err) {
            console.log("Connection err: " + err);
        }
        
        
        var dbo = db.db("users");
        var coll = dbo.collection('profiles');
        //var coll = dbo.collection("profile2");
        
        var myquery = { email: useremail };
                    
        coll.find( myquery ).toArray(function(err, items) {
            
              if (err) {
                  console.log("Error: " + err);  
                  console.log("<br>")
                  return;

              } 
              
              else if( items.length == 0 ) {
                  console.log("no user of this email found");
                  console.log("<br>")
                  return

              }//end else if items = 0 
              
              else   {
                //  console.log(items[0].foods);
                  
                  checkfoods(items[0].foods);
                  db.close();
                  return items[0].foods;
              }//end else 
             // return items[0].foods;
          })//coll find 

      })//mongo connect 

  }//end function         

async function checkfoods(foodarr) {
    console.log("checking: " + foodarr);
    
    //async function getfoods(foodName, curruserfood, numuserfoods, res ) {
        
        tempstring = "";
        
        client =new MongoClient(foodsurl,{ useUnifiedTopology: true });
        
        //await    
        await client.connect( );
            
            var dbo = client.db("tuftsdining");
            var coll = dbo.collection("menu");

            foodstring = "";
            
            
            var query = {food:{ $in: foodarr }}

            //var sendstring = "";
            
            //db.things.find({ words: { $in: ["text", "here"] }});

            await coll.find(query).toArray(function(err,items) {
                if (err) {
                   console.log("Error: " + err);
                } else if (items.length == 0) {
                    console.log(" No food being served with the name " );
                    console.log("\n")
                    console.log()
                } else {
                    
                //    console.log(items);
                    var mystring =  "";
		//mystring is formmatted for email, restring is formmatted for displaying on page
		    var restring = "current users favorite food serving times: <br>";
                    for(i = 0; i < items.length; i++) {
                        //console.log( " served food: " + items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + "\n" );
                        mystring+= items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " for " + items[i].meal + "\n";
			restring += items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " for " + items[i].meal + "<br>";

                    }
                    
                    sendmail(mystring, restring);

                }
                
                //res.write(sendstring);

                
            })
            
        
    //    client.close();
    setTimeout(function(){ client.close(); console.log("Success!");}, 1000);


    //console.log(tempstring);
    return tempstring;


}

var nodemailer = require('nodemailer');

function sendmail(sendstring, restring) {
    
    //                sendstring += (items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " \n") ;

	//outputs string to page:
	res.write(restring);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cpekowsky@gmail.com',
        pass: 'stinkfart101'
      }
    });

    var mailOptions = {
      from: 'cpekowsky@gmail.com',
      to: 'cpekowsky@gmail.com',
      subject: 'foods being served',
      text: sendstring
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
}

	
	
	//end code to email and display stuff 
	setTimeout(function(){res.end();}, 2000);


});


//code to add a food to the users favorites 
app.get('/my_choice.html/userprocess', function (req, res) {
	res.writeHead(200, {'Content-Type':'text/html'});
	
	res.write("Hello");
	
	//const queryObject = url.parse(req.url,true).query;
	
  	res.write(req.url);
	res.write(" SHOUld get actual thing: ")
	var stringURL = req.url.toString()
	res.write(stringURL );
	
	stringURL = stringURL.split("=");
	stringURL = stringURL[1];
	res.write(stringURL );
	
	 MongoClient.connect(userurl,{useUnifiedTopology:true},function(err, db ) {
		 
        currfood = stringURL;
        useremail = "cpekowsky@gmail.com";

            
            
            if (err) {
                console.log("Connection err: " + err);
            }
            var dbo = db.db("users");
            var coll = dbo.collection('profiles');
            //var coll = dbo.collection("profile2");
            
            var myquery = { email: useremail };
            
            var newvalues = { $push: {foods: currfood } };
            coll.updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
             // db.close();
            });

            
    
        

            
            
            coll.find( ).toArray(function(err, items) {
                
                  if (err) {
                      res.write("Error: " + err);  
                  } 
                  
                  if( items.length == 0 ) {
                      res.write("no users.");
                  }
                  
                  else   {
                      for (i=0; i<items.length; i++) {
                          res.write("name:" + items[i].email );
                          res.write( "<br>" );

                      }
                  }
                  
                  db.close();
                  
            })
            
            
            

            /*
            
            collection.insertOne(newData2, function(err, res) {
            if(err) { console.log("query err: " + err); return; }
            console.log("new document inserted");

            }   );
            
            
            */




            
            setTimeout(function(){ db.close(); console.log("Success!");}, 1000);
        })



	
	
	
	setTimeout(function(){res.end();}, 2000);

});

app.get('/menu.html', function (req, res) {
	file = 'menu.html';
	  fs.readFile(file, function(err, txt) {
	      if(err) { return console.log(err); }
	      res.writeHead(200, {'Content-Type': 'text/html'});
	      res.write(txt);
	    });
	
	    //actual mongo query 
    MongoClient.connect(url2, { useUnifiedTopology: true }, function(err, db) {
        if(err) { res.write("Connection err: " + err); return; }
        
        var dbo = db.db("tuftsdining");
        
        console.log(3);
        
        
        var coll = dbo.collection('menu');
        
        console.log(4);
        
        
        
        var myquery = {  };
        
        //here, the query is for things where the ticker is the same as user input
        
        coll.find( ).toArray(function(err, items) {
            
            if (err) {
                res.write("Error: " + err);  
            } 
            
            if( items.length == 0 ) {
                res.write("no foods.");
            }
            
            else   {
                
                
                //really stupid: going through this array like 30 times 
                mealarr = [];
                mealarr = ["breakfast", "Lunch", "Dinner"];
                
                
                for(var numday = 0; numday < 7; numday ++ ) {
                    
                    for(var currmeal = 0; currmeal < 3; currmeal ++) {
                        
                        for (i=0; i<items.length; i++) {
                            
                            
                            if(items[i].numdate == numday && items[i].meal == mealarr[currmeal]) {
                                res.write("hall: " + items[i].hall + " meal: " + items[i].meal + " food: " + items[i].food  + " date: " + items[i].longdate);
                                res.write( "<br>" );
                                
                            }
                            
                        }
                        
                    }                        
                    
                }
                
            }
            
            db.close();
            
        })
        
        
        
        
    });  //end connect

	
	
	
	//end of code for connecting to database and printing all menus 
	setTimeout(function(){res.end();}, 2000);
});


app.listen(port, function() {console.log("server started successfully");});

