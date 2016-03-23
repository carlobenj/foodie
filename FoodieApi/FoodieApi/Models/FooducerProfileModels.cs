using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class FooducerProfileModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public FooducerProfileObjectGet_Response getProfile(int fooducer_ID, int foodict_ID)
        {
            
            if(foodict_ID != 0){
                try
                {
                    view v = new view() { view_source_foodict_ID = foodict_ID, view_target_fooducer_ID = fooducer_ID, view_date = DateTime.UtcNow.Date, view_time = DateTime.UtcNow.TimeOfDay };
                    db.views.InsertOnSubmit(v);
                    db.SubmitChanges();
                }
                catch
                {
                }
            }
            try
            {
                return db.fooducers.Where(f => f.fooducer_ID == fooducer_ID).Select(f => new FooducerProfileObjectGet_Response { 
                    fooducer_ID = f.fooducer_ID,
                    user_name = f.user.user_name,
                    fooducer_company = f.fooducer_company,
                    fooducer_about = f.fooducer_about,
                    fooducer_establishment_address = f.fooducer_establishment_address,
                    fooducer_city = f.fooducer_city,
                    fooducer_country = f.fooducer_country,
                    fooducer_contact = f.fooducer_contact,
                    fooducer_foodie_points = f.fooducer_foodie_points,
                    fooducer_image = f.fooducer_image,
                    fooducer_location_latitude = f.fooducer_location_latitude,
                    fooducer_location_longitude = f.fooducer_location_longitude,
                    fooducer_website = f.fooducer_website,
                    fooducer_fb = f.fooducer_fb,
                    fooducer_twitter = f.fooducer_twitter,
                    fooducer_ig = f.fooducer_ig
                }).First();
            }
            catch (Exception e)
            {
                return new FooducerProfileObjectGet_Response { fooducer_company = e.Message};
            }
        }

        /*EDIT*/
        public bool editMyProfileDetails(FooducerProfileEditObject_Request obj)
        {
            try
            {
                //select the row
                fooducer f = db.fooducers.Where(fd => fd.fooducer_ID == obj.fooducer_ID && fd.user_ID == obj.user_ID).First();
                
                if (obj.type == 1)
                {
                    string uri = fts.foodieAzureStorageUpload(obj.fooducer_image, f.fooducer_ID.ToString(), "fooducers");
                    if (uri != null)
                    {
                        f.fooducer_image = uri;
                        db.SubmitChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else if (obj.type == 2)
                {
                    f.user.user_name = obj.user_name;
                    f.fooducer_company = obj.fooducer_company;
                    f.fooducer_about = obj.fooducer_about;
                    f.fooducer_fb = obj.fooducer_fb;
                    f.fooducer_twitter = obj.fooducer_twitter;
                    f.fooducer_ig = obj.fooducer_ig;
                    f.fooducer_website = obj.fooducer_website;

                    db.SubmitChanges();
                    return true;
                }
                else if (obj.type == 3)
                {
                    f.fooducer_contact = obj.fooducer_contact;
                    f.fooducer_establishment_address = obj.fooducer_establishment_address;
                    f.fooducer_country = obj.fooducer_country;
                    f.fooducer_city = obj.fooducer_city;

                    db.SubmitChanges();
                    return true;
                }
                else if (obj.type == 4)
                {
                    f.fooducer_location_longitude = obj.fooducer_location_longitude;
                    f.fooducer_location_latitude = obj.fooducer_location_latitude;

                    db.SubmitChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }
    }


    /*GET*/
    public class FooducerProfileObjectGet_Response
    {
        public int fooducer_ID { get; set; }
        public string user_name { get; set; }
        public string fooducer_company { get; set; }
        public string fooducer_about { get; set; }
        public string fooducer_contact { get; set; }
        public string fooducer_country { get; set; }
        public string fooducer_city { get; set; }
        public string fooducer_image { get; set; }
        public int? fooducer_foodie_points { get; set; }
        public string fooducer_establishment_address { get; set; }
        public string fooducer_location_longitude { get; set; }
        public string fooducer_location_latitude { get; set; }
        public string fooducer_website { get; set; }
        public string fooducer_fb { get; set; }
        public string fooducer_twitter { get; set; }
        public string fooducer_ig { get; set; }
    }

    public class FooducerProfileObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public FooducerProfileObjectGet_Response result { get; set; }
    }

    public class menu_item
    {
        public int menu_ID { get; set; }
        public int fooducer_ID { get; set; }
        public string menu_image { get; set; }
    }

    /*EDIT*/
    public class FooducerProfileEditObject_Request
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
        public int user_ID { get; set; }
        public int type { get; set; }

        //type 1
        public string fooducer_image { get; set; }

        //type 2
        public string user_name { get; set; }
        public string fooducer_company { get; set; }
        public string fooducer_about { get; set; }
        public string fooducer_fb { get; set; }
        public string fooducer_twitter { get; set; }
        public string fooducer_ig { get; set; }
        public string fooducer_website { get; set; }

        //type 3
        public string fooducer_contact { get; set; }
        public string fooducer_establishment_address { get; set; }
        public string fooducer_country { get; set; }
        public string fooducer_city { get; set; }

        //type 4
        public string fooducer_location_longitude { get; set; }
        public string fooducer_location_latitude { get; set; }
    }

    public class FooducerProfileEditObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}