using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class SuggestModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public SuggestObject_PostResponse getSuggested(int foodict_ID, List<FBObject> obj) 
        {
            try
            {
                //Facebook friends
                List<SuggestObject_ReMap> fb = new List<SuggestObject_ReMap>();
                foreach (var friend in obj)
                {
                    try
                    {
                        foodict fd = db.foodicts.Where(f => f.user.user_fbid == friend.fbid).First();
                        fb.Add(new SuggestObject_ReMap()
                        {
                            foodict_ID = fd.foodict_ID,
                            foodict_image = fd.foodict_image,
                            foodict_full_name = friend.full_name,
                            foodict_username = fd.user.user_name
                        });

                        //FB Friend notification
                        fts.createNotification(5, foodict_ID, fd.foodict_ID);
                        
                    }
                    catch
                    {
                        
                    }
                }

                //Suggested
                List<SuggestObject_ReMap> suggested = new List<SuggestObject_ReMap>();
                List<foodict> top_foodict = db.foodicts.Where(f => f.follows1.Count() > 1).OrderByDescending(f => f.follows1.Count()).Take(15).ToList();
                foreach (foodict itm in top_foodict)
                {
                    if(!fb.Any(f => f.foodict_ID == itm.foodict_ID))
                    {
                        suggested.Add(new SuggestObject_ReMap()
                        {
                            foodict_ID = itm.foodict_ID,
                            foodict_image = itm.foodict_image,
                            foodict_full_name = itm.foodict_first_name + " " + itm.foodict_last_name,
                            foodict_username = itm.user.user_name
                        });
                    }                    
                }


                //return result
                return new SuggestObject_PostResponse()
                {
                    fb_friends = fb,
                    suggested = suggested
                };
            }
            catch
            {
                return null;
            }
        }

        
    }

    /*POST*/
    public class FBObject
    {
        public string fbid { get; set; }
        public string full_name { get; set; }
    }

    public class SuggestObject_PostRequest
    {
        public string api_key { get; set; }
        public int foodict_ID { get; set; }
        public List<FBObject> fbobjects { get; set; }
    }

    public class SuggestObject_ReMap
    {
        public int foodict_ID { get; set; }
        public string foodict_image { get; set; }
        public string foodict_username { get; set; }
        public string foodict_full_name { get; set; }
    }

    public class SuggestObject_PostResponse
    {
        public List<SuggestObject_ReMap> fb_friends { get; set; }
        public List<SuggestObject_ReMap> suggested { get; set; }
    }

    public class SuggestObject_PostResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public SuggestObject_PostResponse result { get; set; }
    }
}