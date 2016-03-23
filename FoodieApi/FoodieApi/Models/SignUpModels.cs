using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace FoodieApi.Models
{
    public class SignUpModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public bool isExistingUsername(string username)
        {
            return db.users.Any(u=> u.user_name == username);
        }

        public int signUpNow(SignupObjectPost_Request obj)
        {

            try
            {
                //existing username
                if (db.users.Any(u => u.user_name == obj.foodict_username))
                {
                    return 2;
                }
                
                //existing fb
                if (db.users.Any(u => u.user_fbid == obj.foodict_fbid) && obj.foodict_fbid != null && obj.foodict_fbid != "")
                {
                    return 3;
                }


                user us = new user()
                {
                    user_email = obj.user_email,
                    user_type = 1,
                    password = obj.user_password,
                    user_name = obj.foodict_username,
                    user_fbid = obj.foodict_fbid
                };
                db.users.InsertOnSubmit(us);
                db.SubmitChanges();


                foodict fd = new foodict()
                {
                    user_ID = us.user_ID,
                    foodict_first_name = obj.foodict_first_name,
                    foodict_middle_name = obj.foodict_middle_name,
                    foodict_last_name = obj.foodict_last_name,
                    foodict_image = obj.foodict_image,
                    foodict_isMale = obj.foodict_isMale,
                    foodict_isPrivate = false,
                    foodict_foodie_points = 0
                };
                db.foodicts.InsertOnSubmit(fd);
                db.SubmitChanges();



                //kapag manual signup ilalagay sa storage ung image
                if (obj.foodict_fbid == null || obj.foodict_fbid == "")
                {
                    //uploading of image
                    string uri = fts.foodieAzureStorageUpload(obj.foodict_image, fd.foodict_ID.ToString(), "foodicts");
                    if (uri != null)
                    {
                        //naupload ung image kaya iuupdate ung uri sa DB
                        fd.foodict_image = uri;
                        db.SubmitChanges();
                    }
                    else
                    {
                        //hindi naupload ung image so idedelete ung foodict
                        db.foodicts.DeleteOnSubmit(fd);
                        db.SubmitChanges();
                        return 4;
                    }
                }

                follow fl = new follow()
                {
                    follow_source_foodict_ID = fd.foodict_ID,
                    follow_target_foodict_ID = fd.foodict_ID,
                    follow_status = 1
                };
                db.follows.InsertOnSubmit(fl);
                db.SubmitChanges();



                //SEND MAIL   
                //email : app.foodie.ph@gmail.com
                //password : opkdtwtmveiakakb

                try
                {
                    var smtp = new SmtpClient
                    {
                        Host = "smtp.gmail.com",
                        Port = 587,
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential("app.foodie.ph@gmail.com", "opkdtwtmveiakakb")
                    };
                    using (var message = new MailMessage("app.foodie.ph@gmail.com", obj.user_email)
                    {
                        IsBodyHtml = true,
                        Subject = "Welcome to Foodie " + obj.foodict_first_name + "!",
                        Body = "<h1>Thanks for signing up on Foodie!</h1>The number one source of food trends right in your pocket.<br/> For safekeeping we sent you your credentails. <br /><br/>  <b>Username: " + obj.foodict_username + "</b> <br /> <b>Password: " + obj.user_password + "</b>"

                    })
                    {
                        smtp.Send(message);
                    } 
                }
                catch 
                { 
                }
                

                return 1;
            }
            catch
            {
                return 4;
            } 

        }
    }

    /*GET*/
    public class SignupObject_exist
    {
        public bool result { get; set; }
    }


    /*POST*/
    public class SignupObjectPost_Request
    {
        public string publicKey { get; set; }

        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public string user_email { get; set; }
        public string foodict_fbid { get; set; }
        public bool foodict_isMale { get; set; }

        public string foodict_image { get; set; }
        public string foodict_username { get; set; }
        public string user_password { get; set; }
    }
    public class SignupObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public int result_code { get; set; }
    }
}