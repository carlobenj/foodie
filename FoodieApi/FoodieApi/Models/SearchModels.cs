using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class SearchModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        public SearchObject_GetResponse searchForThis(int user_ID, string filter)
        {
            try
            {
                return new SearchObject_GetResponse() { 
                    foodict_result = db.foodicts.Where(f => (f.foodict_first_name.StartsWith(filter)
                                    || f.foodict_last_name.StartsWith(filter) || f.user.user_name.StartsWith(filter)) && (f.user_ID != user_ID))
                                    .Select(f => new FoodictObject
                                    {
                                        user_ID = f.user_ID,
                                        foodict_ID = f.foodict_ID,
                                        foodict_username = f.user.user_name,
                                        foodict_fullname = f.foodict_first_name + " " + f.foodict_last_name,
                                        foodict_image = f.foodict_image
                                    }).ToList(),
                    offer_result = db.offers.Where(o => o.offer_title.StartsWith(filter) && (o.fooducer.user_ID != user_ID) && (o.offer_expiry > DateTime.UtcNow || o.offer_max > o.vouchers.Count()))
                                    .Select(o => new OfferObject
                                    {
                                        offer_ID = o.offer_ID,
                                        fooducer_ID = o.fooducer.fooducer_ID,
                                        offer_title = o.offer_title,
                                        offer_text = o.offer_text.Length > 140 ? o.offer_text.ToString() + "..." : o.offer_text,
                                        fooducer_username = o.fooducer.fooducer_username,
                                        offer_image = o.offer_image
                                    }).ToList() 

                };
            }
            catch 
            {
                return null;
            }            
        }
    }

    /*GET*/
    public class SearchObject_GetResponse
    {
        public List<FoodictObject> foodict_result { get; set; }
        public List<OfferObject> offer_result { get; set; }
    }

    public class FoodictObject
    {
        public int user_ID { get; set; }
        public int foodict_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_fullname { get; set; }
        public string foodict_image { get; set; }
    }

    public class OfferObject
    {
        public int offer_ID { get; set; }
        public string offer_image { get; set; }
        public string offer_title { get; set; }
        public string offer_text { get; set; }
        public int fooducer_ID { get; set; }
        public string fooducer_username { get; set; }
    }

    public class SearchObject_GetResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public SearchObject_GetResponse result { get; set; }
    }

}