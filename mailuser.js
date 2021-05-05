var http = require('http');
//var port = process.env.PORT || 3000;
var port = 8080;
//const axios = require('axios');
//const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const userurl = 'mongodb+srv://unellu01:aaa@cluster0.trnuo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const foodsurl = "mongodb+srv://user1:caleb@cluster0.0y4mi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


  getusersfoods("cpekowsky@gmail.com");
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
                    for(i = 0; i < items.length; i++) {
                        //console.log( " served food: " + items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + "\n" );
                        mystring+= items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " for " + items[i].meal + "\n";
                    }
                    
                    sendmail(mystring);

                }
                
                //res.write(sendstring);

                
            })
            
        
    //    client.close();
    setTimeout(function(){ client.close(); console.log("Success!");}, 1000);


    //console.log(tempstring);
    return tempstring;


}

var nodemailer = require('nodemailer');

function sendmail(sendstring) {
    
    //                sendstring += (items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " \n") ;


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
