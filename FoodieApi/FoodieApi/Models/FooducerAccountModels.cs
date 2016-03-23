using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class FooducerAccountModels
    {

        FoodieDBDataContext db = new FoodieDBDataContext();

        public FooducerAccountObject_Response getMyAccount(int user_ID, int fooducer_ID)
        {
            try
            {
                return (from u in db.users
                        join f in db.fooducers on u.user_ID equals f.user_ID
                        where u.user_ID == user_ID && f.fooducer_ID == fooducer_ID
                        select new FooducerAccountObject_Response
                        {
                            user_ID = u.user_ID,
                            fooducer_ID = f.fooducer_ID,
                            user_email = u.user_email,
                            password = u.password,
                            user_name = u.user_name
                        }).First();
            }
            catch
            {
                return null;
            }

        }


        public bool editMyAccount(FooducerEditAccountObject_Request obj)
        {
            user u = db.users.Where(d => d.user_ID == obj.user_ID && d.user_type == 2).First(); //get the row
            fooducer f = db.fooducers.Where(fd => fd.user_ID == obj.user_ID && fd.fooducer_ID == obj.fooducer_ID).First(); //get th
            //kapag may foodict account na tama ung combination
            if (db.fooducers.Any(d => d.user_ID == obj.user_ID && d.fooducer_ID == obj.fooducer_ID))
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
    public class FooducerAccountObject_Request
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
        public int user_ID { get; set; }
    }

    public class FooducerAccountObject_Response
    {
        public int fooducer_ID { get; set; }
        public int user_ID { get; set; }
        public string user_email { get; set; }
        public string user_name { get; set; }
        public string password { get; set; }
    }

    public class FooducerAccountObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public FooducerAccountObject_Response result { get; set; }
    }


    //EDIT ACCOUNT
    public class FooducerEditAccountObject_Request
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
        public int user_ID { get; set; }
        public int type { get; set; }

        //type 1
        public string user_email { get; set; }

        //type 2
        public string password { get; set; }

        //type 3
        public string user_name { get; set; }
    }

    public class FooducerEditAccountObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}