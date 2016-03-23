using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class PostModels
    {

        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public bool postNewBlog(PostObject_Insert obj)
        {
            try
            {
                post p = new post();
                p.foodict_ID = obj.foodict_ID;
                p.post_title = obj.post_title;
                p.post_text = obj.post_text;
                p.post_type = "1";
                p.post_date = DateTime.UtcNow;
                p.post_location_latitude = obj.post_location_latitude;
                p.post_location_longitude = obj.post_location_longitude;
                p.post_nearby_establishment = obj.post_nearby_establishment;
                p.post_rating = obj.post_rating;
                db.posts.InsertOnSubmit(p);
                db.SubmitChanges();


                //uploading of image
                string uri = fts.foodieAzureStorageUpload(obj.post_image, p.post_ID.ToString(), "posts");
                if (uri != null)
                {
                    //naupload ung image kaya iuupdate ung uri sa DB
                    p.post_image = uri;
                    db.SubmitChanges();
                    return true;
                }
                else
                {
                    //hindi naupload ung image so idedelete ung post sa DB
                    db.posts.DeleteOnSubmit(p);
                    db.SubmitChanges();
                    return false;
                }
            }
            catch 
            {
                return false;
            }
            
        }
    }

    //classes




    public class PostObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }


    public class PostObject_Insert
    {
        public string api_key { get; set; }
        public int foodict_ID { get; set; }
        public string post_title { get; set; }
        public string post_text { get; set; }
        public string post_image { get; set; }
        public string post_location_latitude { get; set; }
        public string post_location_longitude { get; set; }
        public string post_nearby_establishment { get; set; }
        public int? post_rating { get; set; }
    }
}