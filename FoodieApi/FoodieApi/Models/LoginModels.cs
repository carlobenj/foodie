using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace FoodieApi.Models
{
    public class LoginModels : FoodieToolSet
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public LoginObjectGet_Response loginWithFacebook(string fbid)
        {
            try
            {
                return db.users.Where(u => u.user_fbid == fbid).Select(u => new LoginObjectGet_Response
                {
                    username = u.user_name,
                    password = u.password,
                    isSignedUp = true
                }).First();
            }
            catch
            {
                return new LoginObjectGet_Response()
                {
                    username = null,
                    password = null,
                    isSignedUp = false
                };
            }
        }

        public LoginObject_Response requestForApiKey(string username, string password)
        {
            LoginObject_Response response = new LoginObject_Response();

            var acc = db.users.Where(u => u.user_name == username && u.password == password).ToList();
            //var query = db.users.Where(u => u.user_email == username && u.password == password).ToList();

            //Return null if two account match
            if (acc.Count() != 1)
                return null;

            switch(acc.First().user_type)
            {
                case 1:
                    response = (from u in db.users
                                join fi in db.foodicts on u.user_ID equals fi.user_ID
                                where u.user_ID == acc.First().user_ID
                                select new LoginObject_Response { 
                                        user_ID = u.user_ID,
                                        user_type = "foodict",
                                        MyID = fi.foodict_ID,
                                        api_key = EncryptData(fi.foodict_ID, Hash)                                                       
                                }).First();
                    break;
                case 2:
                    response = (from u in db.users
                                join fu in db.fooducers on u.user_ID equals fu.user_ID
                                where u.user_ID == acc.First().user_ID
                                select new LoginObject_Response
                                {
                                    user_ID = u.user_ID,
                                    user_type = "fooducer",
                                    MyID = fu.fooducer_ID,
                                    api_key = EncryptData(fu.fooducer_ID, Hash)
                                }).First();
                    break;
                case 3:
                    //response = new LoginObject_Response { user_ID = 00000, user_type = "admin", MyID = 00000, api_key = EncryptData(00000, Hash) };
                    response = (from u in db.users
                                where u.user_ID == acc.First().user_ID
                                select new LoginObject_Response
                                {
                                    user_ID = u.user_ID,
                                    user_type = "admin",
                                    MyID = u.user_ID,
                                    api_key = EncryptData(u.user_ID, Hash)
                                }).First();
                    break;
                default:
                    response = null;
                    break;
            }
            

            
            //Return the object
            return response;
        }

        public int forgotPassword(string username, string user_email) 
        {
            try
            {
                if (db.users.Any(us => us.user_name == username && us.user_email == user_email))
                {
                    //Random password
                    Random random = new Random((int)DateTime.Now.Ticks);
                    Random caps = new Random();
                    StringBuilder builder = new StringBuilder();
                    char ch;
                    for (int i = 0; i < 12; i++)
                    {
                        ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                        //if (caps.Next(100) < 50)
                        //{
                        //    ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                        //}
                        //else
                        //{
                        //    ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 97)));
                        //}
                        builder.Append(ch);
                    }


                    //change password
                    user u = db.users.Where(us => us.user_name == username && us.user_email == user_email).First();
                    u.password = builder.ToString();
                    db.SubmitChanges();

                    //send email
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
                        using (var message = new MailMessage("app.foodie.ph@gmail.com", u.user_email)
                        {
                            IsBodyHtml = true,
                            Subject = "Dear "+u.user_name+", your password on Foodie was reset.",
                            Body = "<p>You reset your password last "+ DateTime.UtcNow +" (UTC Time). Your new password is <b>"+ u.password+"</b>. If you didn't changed your password, please report it by replying on this email.</p>"

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
                else
                {
                    return 0;
                }
            }
            catch
            {
                return 2;
            }
            
        }

    }


    //NORMAL LOGIN
    public class LoginObject_Request
    {
        public string username { get; set; }
        public string password { get; set; }
        public string publicKey { get; set; }
    }

    public class LoginObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public LoginObject_Response result { get; set; }
    }

    public class LoginObject_Response
    {
        public string api_key { get; set; }
        public int user_ID { get; set; }
        public int MyID { get; set; }
        public string user_type { get; set; }
    }


    //FB LOGIN
    public class LoginObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public LoginObjectGet_Response result { get; set; }
    }
    public class LoginObjectGet_Response
    {
        public string username { get; set; }
        public string password { get; set; }
        public bool isSignedUp { get; set; }
    }


    //PUT
    public class LoginObjectPut_Request
    {
        public string publicKey { get; set; }
        public string username { get; set; }
        public string user_email { get; set; }
    }

    public class LoginObjectPut_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public int result { get; set; }
    }
}