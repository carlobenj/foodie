using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class EditModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        public EditObject_Response getEditItems(int user_ID, int foodict_ID) 
        {
            try
            {
                return (from f in db.foodicts
                        join u in db.users on f.user_ID equals u.user_ID
                        where f.user_ID == user_ID && f.foodict_ID == foodict_ID
                        select new EditObject_Response
                        {
                            foodict_ID = f.foodict_ID,
                            user_ID = f.user_ID,
                            foodict_username = f.user.user_name,
                            foodict_first_name = f.foodict_first_name,
                            foodict_middle_name = f.foodict_middle_name,
                            foodict_last_name = f.foodict_last_name,
                            foodict_isMale = f.foodict_isMale,
                            foodict_contact = f.foodict_contact,
                            foodict_country = f.foodict_country,
                            foodict_city = f.foodict_city,
                            foodict_image = f.foodict_image
                        }).First();
            }
            catch
            {
                return null;
            }
            
        }
    }

    public class EditObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public EditObject_Response result { get; set; }

    }


    //Edit Profile


    public class EditObject_Request
    {
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public bool? foodict_isMale { get; set; }
        public string foodict_contact { get; set; }
        public string foodict_country { get; set; }
        public string foodict_city { get; set; }
        public string foodict_image { get; set; }
    }


    public class EditObject_Response
    {
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public bool? foodict_isMale { get; set; }
        public string foodict_contact { get; set; }
        public string foodict_country { get; set; }
        public string foodict_city { get; set; }
        public string foodict_image { get; set; }
    }
}