using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class AccountModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();

        public AccountObject_Response getMyAccount(int user_ID, int foodict_ID) 
        {
            try
            {
                return (from u in db.users
                        join f in db.foodicts on u.user_ID equals f.user_ID
                        where u.user_ID == user_ID && f.foodict_ID == foodict_ID
                        select new AccountObject_Response
                        {
                            user_ID = u.user_ID,
                            foodict_ID = f.foodict_ID,
                            user_email = u.user_email,
                            password = u.password,
                            user_name = u.user_name,
                            foodict_isPrivate = f.foodict_isPrivate
                        }).First();
            }
            catch 
            {
                return null;
            }
            
        }


        public bool editMyAccount(EditAccountObject_Request obj) 
        {
            user u = db.users.Where(d => d.user_ID == obj.user_ID && d.user_type == 1).First(); //get the row
            foodict f = db.foodicts.Where(fd => fd.user_ID == obj.user_ID && fd.foodict_ID == obj.foodict_ID).First(); //get th
            //kapag may foodict account na tama ung combination
            if (db.foodicts.Any(d => d.user_ID == obj.user_ID && d.foodict_ID == obj.foodict_ID)) 
            {
                if (obj.type == 1)
                {
                    u.user_email = obj.user_email;
                }
                else if (obj.type == 2)
                {
                    u.password = obj.password;
                }
                else if (obj.type == 3)
                {
                    f.foodict_isPrivate = obj.foodict_isPrivate;
                }
                else if (obj.type == 4)
                {
                    u.user_name = obj.user_name;
                }
                else
                {
                    return false;
                }

                db.SubmitChanges();
                return true;
            }
            else
            {
                return true;
            }
        }

    }

    //GET ACCOUNT
    public class AccountObject_Request
    {
        public string api_key { get; set; }
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
    }

    public class AccountObject_Response
    {
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public string user_email { get; set; }
        public string user_name { get; set; }
        public string password { get; set; }
        public bool? foodict_isPrivate { get; set; }
    }

    public class AccountObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public AccountObject_Response result { get; set; }
    }


    //EDIT ACCOUNT
    public class EditAccountObject_Request
    {
        public string api_key { get; set; }
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public int type { get; set; }

        //type 1
        public string user_email { get; set; }

        //type 2
        public string password { get; set; }

        //type 3
        public bool? foodict_isPrivate { get; set; }

        //type 4
        public string user_name { get; set; }
    }

    public class EditAccountObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

}